import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'
import { defineBasicExtension } from 'prosekit/basic'
import { createEditor } from 'prosekit/core'
import { ProseKit, useDocChange } from 'prosekit/react'
import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import type { BlogDocJSON } from '@/features/blog/model/types'
import { emptyBlogDoc } from '@/features/blog/model/content'
import { cn } from '@/lib/utils'

interface ProseKitEditorProps {
  value: BlogDocJSON
  onChange: (value: BlogDocJSON) => void
  className?: string
}

interface ChangeBridgeProps {
  editor: ReturnType<typeof createEditor>
  serializedRef: MutableRefObject<string>
  onChange: (value: BlogDocJSON) => void
}

function ChangeBridge({ editor, serializedRef, onChange }: ChangeBridgeProps) {
  useDocChange(
    () => {
      const next = editor.getDocJSON()
      const serialized = JSON.stringify(next)

      if (serialized === serializedRef.current) {
        return
      }

      serializedRef.current = serialized
      onChange(next)
    },
    { editor },
  )

  return null
}

export function ProseKitEditor({ value, onChange, className }: ProseKitEditorProps) {
  const editor = useMemo(() => {
    return createEditor({
      extension: defineBasicExtension(),
      defaultContent: emptyBlogDoc(),
    })
  }, [])

  const serializedRef = useRef('')

  useEffect(() => {
    const nextDoc = value.type === 'doc' ? value : emptyBlogDoc()
    const serialized = JSON.stringify(nextDoc)

    if (serialized === serializedRef.current) {
      return
    }

    editor.setContent(nextDoc)
    serializedRef.current = serialized
  }, [editor, value])

  return (
    <div className={cn('rounded-xl border border-border bg-background p-3', className)}>
      <ProseKit editor={editor}>
        <ChangeBridge
          editor={editor}
          serializedRef={serializedRef}
          onChange={onChange}
        />
        <div
          ref={editor.mount}
          className="prose prose-sm dark:prose-invert max-w-none min-h-[320px] rounded-md p-2"
        />
      </ProseKit>
    </div>
  )
}
