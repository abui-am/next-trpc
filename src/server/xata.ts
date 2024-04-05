// Generated by Xata Codegen 0.29.3. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";

const tables = [
  {
    name: "user",
    columns: [
      { name: "username", type: "string" },
      { name: "email", type: "string" },
      { name: "password", type: "string" },
    ],
  },
  {
    name: "todo",
    columns: [
      { name: "content", type: "text" },
      { name: "done", type: "bool" },
    ],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type User = InferredTypes["user"];
export type UserRecord = User & XataRecord;

export type Todo = InferredTypes["todo"];
export type TodoRecord = Todo & XataRecord;

export type DatabaseSchema = {
  user: UserRecord;
  todo: TodoRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://Abui-s-workspace-603dfk.ap-southeast-2.xata.sh/db/trpc-example",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
