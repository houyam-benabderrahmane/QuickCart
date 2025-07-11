import { Inngest } from "inngest";
import connectDB from "./db"; // ✅ Ensure this path is correct
import User from "@/models/User"; // ✅ Ensure this path is correct

export const inngest = new Inngest({ id: "quickcart-next" });

// ✅ Create User
export const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk-create" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address, // ✅ correct key
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      };

      await connectDB();
      await User.create(userData);

      return { message: "User created" };
    } catch (error) {
      console.error("Error in syncUserCreation:", error);
      throw new Error("User creation failed");
    }
  }
);

// ✅ Update User
export const syncUserUpdation = inngest.createFunction(
  { id: "sync-user-from-clerk-update" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        email: email_addresses[0].email_address,
        name: `${first_name} ${last_name}`,
        imageUrl: image_url,
      };

      await connectDB();
      await User.findByIdAndUpdate(id, userData);

      return { message: "User updated" };
    } catch (error) {
      console.error("Error in syncUserUpdation:", error);
      throw new Error("User update failed");
    }
  }
);

// ✅ Delete User
export const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-from-clerk-delete" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    try {
      const { id } = event.data;

      await connectDB();
      await User.findByIdAndDelete(id);

      return { message: "User deleted" };
    } catch (error) {
      console.error("Error in syncUserDeletion:", error);
      throw new Error("User deletion failed");
    }
  }
);
