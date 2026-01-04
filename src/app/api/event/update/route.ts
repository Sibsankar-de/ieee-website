import { updateEvent } from "@/lib/controllers/event.controller";
import { withDbAndCors } from "@/lib/utils/withDbAndCors";
import { NextRequest } from "next/server";
import { runMiddlewares } from "@/lib/utils/middlewareControll";
import { verifyAuth } from "@/lib/middlewares/auth.middleware";
import { verifyRole } from "@/lib/middlewares/verifyRole.middleware";
import { fileHandle } from "@/lib/middlewares/fileHandle.middleware";

export const PATCH = withDbAndCors(async (req: NextRequest) => {
  const context = await runMiddlewares(req, [
    verifyAuth,
    (r, c) => verifyRole(r, c, ["admin", "member"]),
    fileHandle,
  ]);
  return await updateEvent(req, context);
});
