import { useState } from 'react'
import { toast } from 'sonner'
import type { EmailTopic } from '@/features/email/model/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { subscribeToEmailTopicFn } from '@/features/email/client/email'

interface EmailSubscribeCardProps {
  title: string
  description: string
  topic: Extract<EmailTopic, 'blog' | 'press' | 'product'>
}

export function EmailSubscribeCard({
  title,
  description,
  topic,
}: EmailSubscribeCardProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-muted-foreground text-sm">{description}</p>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={async (event) => {
            event.preventDefault()
            setIsSubmitting(true)

            try {
              await subscribeToEmailTopicFn({
                data: {
                  email,
                  topic,
                  source: 'public',
                },
              })

              toast.success('Subscription updated successfully')
              setEmail('')
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : 'Failed to update subscription',
              )
            } finally {
              setIsSubmitting(false)
            }
          }}
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Subscribe'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
