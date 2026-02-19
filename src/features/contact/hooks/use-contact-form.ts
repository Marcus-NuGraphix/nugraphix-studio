import { useState } from 'react'
import { toast } from 'sonner'
import type { FormEvent } from 'react'
import type {
  ContactPreferredContactMethod,
  ContactPropertyType,
  ContactServiceInterest,
  ContactUrgency,
} from '@/features/contact/model/lead-form'
import {
  serviceInterestLabels,
  urgencyLabels,
} from '@/features/contact/model/lead-form'
import { executeRecaptcha } from '@/features/contact/lib/recaptcha.client'
import { submitContactFormFn } from '@/features/contact/client/contact'

interface ContactFormState {
  name: string
  email: string
  phone: string
  suburb: string
  serviceInterest: ContactServiceInterest
  propertyType: ContactPropertyType
  urgency: ContactUrgency
  preferredContactMethod: ContactPreferredContactMethod
  bestContactTime: string
  subject: string
  message: string
  consentToContact: boolean
  wantsCopy: boolean
  website: string
}

const INITIAL_STATE: ContactFormState = {
  name: '',
  email: '',
  phone: '',
  suburb: '',
  serviceInterest: 'discovery-consultation',
  propertyType: 'small-business',
  urgency: 'this-month',
  preferredContactMethod: 'phone',
  bestContactTime: '',
  subject: '',
  message: '',
  consentToContact: true,
  wantsCopy: true,
  website: '',
}

const RECAPTCHA_ACTION = 'contact_form'

export function useContactForm() {
  const [state, setState] = useState<ContactFormState>(INITIAL_STATE)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMountedAt, setFormMountedAt] = useState(() => Date.now())

  const setField = <TField extends keyof ContactFormState>(
    field: TField,
    value: ContactFormState[TField],
  ) => {
    setState((previous) => ({ ...previous, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      if (!state.consentToContact) {
        throw new Error('Consent is required before submitting.')
      }

      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? ''
      const recaptchaToken = await executeRecaptcha({
        siteKey,
        action: RECAPTCHA_ACTION,
      })

      const sourcePath =
        typeof window !== 'undefined' ? window.location.pathname : '/contact'

      const customSubject = state.subject.trim()
      const leadSubject =
        customSubject.length >= 3
          ? customSubject
          : `Lead: ${serviceInterestLabels[state.serviceInterest]} - ${urgencyLabels[state.urgency]} (${state.suburb.trim() || 'Location not provided'})`

      await submitContactFormFn({
        data: {
          ...state,
          subject: leadSubject,
          recaptchaToken,
          sourcePath,
          submittedAt: new Date(formMountedAt).toISOString(),
          consentToContact: true,
          topic: 'contact',
        },
      })

      toast.success(
        'Request sent successfully. Our team will contact you shortly.',
      )
      setState(INITIAL_STATE)
      setFormMountedAt(Date.now())
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to send contact request',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    ...state,
    isSubmitting,
    setName: (name: string) => setField('name', name),
    setEmail: (email: string) => setField('email', email),
    setSubject: (subject: string) => setField('subject', subject),
    setMessage: (message: string) => setField('message', message),
    setWantsCopy: (wantsCopy: boolean) => setField('wantsCopy', wantsCopy),
    setPhone: (phone: string) => setField('phone', phone),
    setSuburb: (suburb: string) => setField('suburb', suburb),
    setServiceInterest: (serviceInterest: ContactServiceInterest) =>
      setField('serviceInterest', serviceInterest),
    setPropertyType: (propertyType: ContactPropertyType) =>
      setField('propertyType', propertyType),
    setUrgency: (urgency: ContactUrgency) => setField('urgency', urgency),
    setPreferredContactMethod: (
      preferredContactMethod: ContactPreferredContactMethod,
    ) => setField('preferredContactMethod', preferredContactMethod),
    setBestContactTime: (bestContactTime: string) =>
      setField('bestContactTime', bestContactTime),
    setConsentToContact: (consentToContact: boolean) =>
      setField('consentToContact', consentToContact),
    setWebsite: (website: string) => setField('website', website),
    handleSubmit,
  }
}
