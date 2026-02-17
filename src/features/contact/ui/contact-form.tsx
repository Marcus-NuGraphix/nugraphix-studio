import { Loader2 } from 'lucide-react'
import type {
  ContactPreferredContactMethod,
  ContactPropertyType,
  ContactServiceInterest,
  ContactUrgency,
} from '@/features/contact/model/lead-form'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useContactForm } from '@/features/contact/hooks/use-contact-form'
import {
  contactPreferredContactValues,
  contactPropertyTypeValues,
  contactServiceInterestValues,
  contactUrgencyValues,
  preferredContactLabels,
  propertyTypeLabels,
  serviceInterestLabels,
  urgencyLabels,
} from '@/features/contact/model/lead-form'

export function ContactForm() {
  const form = useContactForm()

  return (
    <form
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
      onSubmit={form.handleSubmit}
    >
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Project inquiry form
        </h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Provide enough context for a useful first conversation. The more
          specific the operational details, the faster we can align.
        </p>
      </header>

      <FieldGroup>
        <Field className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-name">Full name</FieldLabel>
            <Input
              id="contact-name"
              value={form.name}
              onChange={(event) => form.setName(event.target.value)}
              placeholder="Jane Doe"
              autoComplete="name"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-email">Work email</FieldLabel>
            <Input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={(event) => form.setEmail(event.target.value)}
              placeholder="jane@company.com"
              autoComplete="email"
              required
            />
          </Field>
        </Field>

        <Field className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-phone">Phone number</FieldLabel>
            <Input
              id="contact-phone"
              value={form.phone}
              onChange={(event) => form.setPhone(event.target.value)}
              placeholder="+27 82 000 0000"
              autoComplete="tel"
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="contact-location">Area or region</FieldLabel>
            <Input
              id="contact-location"
              value={form.suburb}
              onChange={(event) => form.setSuburb(event.target.value)}
              placeholder="Johannesburg, Gauteng"
              autoComplete="off"
              required
            />
          </Field>
        </Field>

        <Field className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-service-interest">
              Service interest
            </FieldLabel>
            <Select
              value={form.serviceInterest}
              onValueChange={(value) =>
                form.setServiceInterest(value as ContactServiceInterest)
              }
            >
              <SelectTrigger id="contact-service-interest" className="w-full">
                <SelectValue placeholder="Select a service track" />
              </SelectTrigger>
              <SelectContent>
                {contactServiceInterestValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {serviceInterestLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-org-profile">
              Organization profile
            </FieldLabel>
            <Select
              value={form.propertyType}
              onValueChange={(value) =>
                form.setPropertyType(value as ContactPropertyType)
              }
            >
              <SelectTrigger id="contact-org-profile" className="w-full">
                <SelectValue placeholder="Select an organization profile" />
              </SelectTrigger>
              <SelectContent>
                {contactPropertyTypeValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {propertyTypeLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Field>

        <Field className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="contact-urgency">Timeline</FieldLabel>
            <Select
              value={form.urgency}
              onValueChange={(value) =>
                form.setUrgency(value as ContactUrgency)
              }
            >
              <SelectTrigger id="contact-urgency" className="w-full">
                <SelectValue placeholder="Select a timeline" />
              </SelectTrigger>
              <SelectContent>
                {contactUrgencyValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {urgencyLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="contact-preferred-method">
              Preferred contact method
            </FieldLabel>
            <Select
              value={form.preferredContactMethod}
              onValueChange={(value) =>
                form.setPreferredContactMethod(
                  value as ContactPreferredContactMethod,
                )
              }
            >
              <SelectTrigger id="contact-preferred-method" className="w-full">
                <SelectValue placeholder="Select a contact method" />
              </SelectTrigger>
              <SelectContent>
                {contactPreferredContactValues.map((value) => (
                  <SelectItem key={value} value={value}>
                    {preferredContactLabels[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-best-time">
            Best time to contact you
          </FieldLabel>
          <Input
            id="contact-best-time"
            value={form.bestContactTime}
            onChange={(event) => form.setBestContactTime(event.target.value)}
            placeholder="Weekdays 09:00 - 14:00 SAST"
            autoComplete="off"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
          <Input
            id="contact-subject"
            value={form.subject}
            onChange={(event) => form.setSubject(event.target.value)}
            placeholder="Workflow and reporting modernization"
            autoComplete="off"
          />
          <FieldDescription>
            Optional. Leave blank and we will generate a subject from your
            selected service and timeline.
          </FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="contact-message">Project context</FieldLabel>
          <Textarea
            id="contact-message"
            value={form.message}
            onChange={(event) => form.setMessage(event.target.value)}
            placeholder="Describe your current tools, process bottlenecks, and the outcome you need."
            rows={6}
            required
          />
        </Field>

        <Field className="space-y-3">
          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Checkbox
              id="contact-consent"
              checked={form.consentToContact}
              onCheckedChange={(checked) =>
                form.setConsentToContact(checked === true)
              }
              aria-describedby="contact-consent-description"
            />
            <div className="space-y-1">
              <FieldLabel htmlFor="contact-consent">
                I consent to be contacted regarding this inquiry.
              </FieldLabel>
              <FieldDescription id="contact-consent-description">
                Required for submission.
              </FieldDescription>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <Checkbox
              id="contact-copy"
              checked={form.wantsCopy}
              onCheckedChange={(checked) => form.setWantsCopy(checked === true)}
            />
            <div className="space-y-1">
              <FieldLabel htmlFor="contact-copy">
                Send me a copy of this submission.
              </FieldLabel>
              <FieldDescription>
                You will receive a confirmation email once your request is
                accepted.
              </FieldDescription>
            </div>
          </div>
        </Field>

        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          value={form.website}
          onChange={(event) => form.setWebsite(event.target.value)}
        />

        <Button
          type="submit"
          disabled={form.isSubmitting || !form.consentToContact}
          className="w-full sm:w-auto"
        >
          {form.isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Sending inquiry...
            </>
          ) : (
            'Send Project Inquiry'
          )}
        </Button>
      </FieldGroup>
    </form>
  )
}
