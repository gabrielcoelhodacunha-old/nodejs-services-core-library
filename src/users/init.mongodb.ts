import { mongoDatabase, uuidBsonType } from "../mongodb";
import type { UserModel } from "./model";

mongoDatabase.createCollection<UserModel>("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["external_id", "email", "password", "created_at"],
      properties: {
        external_id: uuidBsonType,
        email: { bsonType: "string" },
        password: { bsonType: "string" },
        created_at: { bsonType: "date" },
      },
    },
  },
});

mongoDatabase.createIndex("users", { external_id: 1 }, { unique: true });
mongoDatabase.createIndex("users", { email: 1 }, { unique: true });
