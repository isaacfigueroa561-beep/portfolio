import { Router, type IRouter } from "express";
import { db, contactsTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contacts", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      ...(parsed.data.project != null ? { project: parsed.data.project } : {}),
    })
    .returning();

  req.log.info({ contactId: contact.id }, "New contact form submission saved");
  res.status(201).json(contact);
});

export default router;
