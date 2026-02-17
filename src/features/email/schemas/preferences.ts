import { z } from 'zod'

export const emailPreferenceSchema = z.object({
  transactionalEnabled: z.boolean(),
  editorialEnabled: z.boolean(),
  blogUpdatesEnabled: z.boolean(),
  pressUpdatesEnabled: z.boolean(),
  productUpdatesEnabled: z.boolean(),
  securityAlertsEnabled: z.boolean(),
})

export const emailPreferenceUpdateSchema = emailPreferenceSchema.superRefine(
  (value, context) => {
    if (!value.transactionalEnabled) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['transactionalEnabled'],
        message: 'Transactional emails cannot be fully disabled.',
      })
    }

    if (!value.editorialEnabled) {
      return
    }

    if (
      !value.blogUpdatesEnabled &&
      !value.pressUpdatesEnabled &&
      !value.productUpdatesEnabled
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['editorialEnabled'],
        message:
          'Enable at least one editorial topic or disable editorial emails.',
      })
    }
  },
)

export type EmailPreferenceInput = z.infer<typeof emailPreferenceUpdateSchema>
