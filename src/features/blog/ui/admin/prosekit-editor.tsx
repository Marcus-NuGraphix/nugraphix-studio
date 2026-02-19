import 'prosekit/basic/style.css'
import 'prosekit/basic/typography.css'
import { defineBasicExtension } from 'prosekit/basic'
import { createEditor } from 'prosekit/core'
import { ProseKit, useDocChange, useEditorDerivedValue } from 'prosekit/react'
import {
  Bold,
  Code2,
  Eraser,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BasicExtension } from 'prosekit/basic'
import type { Editor } from 'prosekit/core'
import type { MutableRefObject, ReactNode } from 'react'
import type { BlogDocJSON } from '@/features/blog/model/types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { emptyBlogDoc } from '@/features/blog/model/content'
import { cn } from '@/lib/utils'

interface ProseKitEditorProps {
  value: BlogDocJSON
  onChange: (value: BlogDocJSON) => void
  className?: string
}

type EditorInstance = Editor<BasicExtension>

interface ChangeBridgeProps {
  editor: EditorInstance
  serializedRef: MutableRefObject<string>
  onChange: (value: BlogDocJSON) => void
}

interface ToolbarButtonProps {
  label: string
  shortcut?: string
  disabled?: boolean
  isActive?: boolean
  onClick: () => void
  children: ReactNode
}

interface ToolbarState {
  isBold: boolean
  isItalic: boolean
  isUnderline: boolean
  isStrike: boolean
  isCode: boolean
  isParagraph: boolean
  isHeading2: boolean
  isHeading3: boolean
  isBlockquote: boolean
  isCodeBlock: boolean
  isBulletList: boolean
  isOrderedList: boolean
  isLink: boolean
  canUndo: boolean
  canRedo: boolean
  canBold: boolean
  canItalic: boolean
  canUnderline: boolean
  canStrike: boolean
  canCode: boolean
  canParagraph: boolean
  canHeading2: boolean
  canHeading3: boolean
  canBlockquote: boolean
  canCodeBlock: boolean
  canBulletList: boolean
  canOrderedList: boolean
  canAddLink: boolean
  canRemoveLink: boolean
  canInsertImage: boolean
  canInsertRule: boolean
  canClearFormatting: boolean
}

const normalizeLinkHref = (value: string): string => {
  const trimmedValue = value.trim()
  if (trimmedValue.length === 0) {
    return ''
  }

  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
}

const normalizeImageSrc = (value: string): string => {
  const trimmedValue = value.trim()
  if (trimmedValue.length === 0) {
    return ''
  }

  if (/^(https?:\/\/|\/)/i.test(trimmedValue)) {
    return trimmedValue
  }

  return `https://${trimmedValue}`
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

function ToolbarButton({
  label,
  shortcut,
  disabled,
  isActive,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={isActive ? 'secondary' : 'ghost'}
          size="icon-sm"
          className={cn('shrink-0', isActive && 'bg-muted')}
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClick}
          disabled={disabled}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {shortcut ? `${label} (${shortcut})` : label}
      </TooltipContent>
    </Tooltip>
  )
}

function AddLinkDialog({
  editor,
  disabled,
}: {
  editor: EditorInstance
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const [href, setHref] = useState('')

  const applyLink = () => {
    const normalizedHref = normalizeLinkHref(href)
    if (normalizedHref.length === 0) {
      return
    }

    editor.focus()
    const didInsertLink = editor.commands.addLink({ href: normalizedHref })
    if (!didInsertLink) {
      return
    }

    setOpen(false)
    setHref('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setHref('')
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Add link"
              disabled={disabled}
            >
              <Link2 />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Add link
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Link</DialogTitle>
          <DialogDescription>
            Insert a link for the selected text.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            applyLink()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="editor-link-url">URL</Label>
            <Input
              id="editor-link-url"
              autoFocus
              value={href}
              onChange={(event) => setHref(event.target.value)}
              placeholder="https://nugraphix.co.za"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!href.trim()}
            >
              Apply link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AddImageDialog({
  editor,
  disabled,
}: {
  editor: EditorInstance
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const [src, setSrc] = useState('')

  const insertImage = () => {
    const normalizedSrc = normalizeImageSrc(src)
    if (normalizedSrc.length === 0) {
      return
    }

    editor.focus()
    const didInsertImage = editor.commands.insertImage({ src: normalizedSrc })
    if (!didInsertImage) {
      return
    }

    setOpen(false)
    setSrc('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) {
          setSrc('')
        }
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="shrink-0"
              onMouseDown={(event) => event.preventDefault()}
              aria-label="Insert image"
              disabled={disabled}
            >
              <ImagePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8}>
          Insert image
        </TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogDescription>
            Add an image URL to embed in the article.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            insertImage()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="editor-image-url">Image URL</Label>
            <Input
              id="editor-image-url"
              autoFocus
              value={src}
              onChange={(event) => setSrc(event.target.value)}
              placeholder="https://cdn.nugraphix.co.za/blog/hero-image.jpg"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={!src.trim()}
            >
              Insert image
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function EditorToolbar({ editor }: { editor: EditorInstance }) {
  const toolbarState = useEditorDerivedValue(
    useCallback((instance: EditorInstance): ToolbarState => {
      return {
        isBold: instance.marks.bold.isActive(),
        isItalic: instance.marks.italic.isActive(),
        isUnderline: instance.marks.underline.isActive(),
        isStrike: instance.marks.strike.isActive(),
        isCode: instance.marks.code.isActive(),
        isParagraph: instance.nodes.paragraph.isActive(),
        isHeading2: instance.nodes.heading.isActive({ level: 2 }),
        isHeading3: instance.nodes.heading.isActive({ level: 3 }),
        isBlockquote: instance.nodes.blockquote.isActive(),
        isCodeBlock: instance.nodes.codeBlock.isActive(),
        isBulletList: instance.nodes.list.isActive({ kind: 'bullet' }),
        isOrderedList: instance.nodes.list.isActive({ kind: 'ordered' }),
        isLink: instance.marks.link.isActive(),
        canUndo: instance.commands.undo.canExec(),
        canRedo: instance.commands.redo.canExec(),
        canBold: instance.commands.toggleBold.canExec(),
        canItalic: instance.commands.toggleItalic.canExec(),
        canUnderline: instance.commands.toggleUnderline.canExec(),
        canStrike: instance.commands.toggleStrike.canExec(),
        canCode: instance.commands.toggleCode.canExec(),
        canParagraph: instance.commands.setParagraph.canExec(),
        canHeading2: instance.commands.toggleHeading.canExec({ level: 2 }),
        canHeading3: instance.commands.toggleHeading.canExec({ level: 3 }),
        canBlockquote: instance.commands.toggleBlockquote.canExec(),
        canCodeBlock: instance.commands.toggleCodeBlock.canExec(),
        canBulletList: instance.commands.toggleList.canExec({ kind: 'bullet' }),
        canOrderedList: instance.commands.toggleList.canExec({ kind: 'ordered' }),
        canAddLink: instance.commands.addLink.canExec({
          href: 'https://nugraphix.co.za',
        }),
        canRemoveLink: instance.commands.removeLink.canExec(),
        canInsertImage: instance.commands.insertImage.canExec({
          src: 'https://cdn.nugraphix.co.za/content/example-image.jpg',
        }),
        canInsertRule: instance.commands.insertHorizontalRule.canExec(),
        canClearFormatting:
          instance.commands.unsetMark.canExec() ||
          instance.commands.unsetBlockType.canExec() ||
          instance.commands.unwrapList.canExec(),
      }
    }, []),
    { editor },
  )

  const runCommand = useCallback(
    (command: () => boolean) => {
      editor.focus()
      command()
    },
    [editor],
  )

  const clearFormatting = useCallback(() => {
    editor.focus()
    editor.commands.unsetMark()
    if (editor.commands.unwrapList.canExec()) {
      editor.commands.unwrapList()
    }
    editor.commands.unsetBlockType()
    editor.commands.setParagraph()
  }, [editor])

  return (
    <TooltipProvider delayDuration={100}>
      <div className="rounded-lg border border-border bg-muted/30">
        <ScrollArea className="w-full">
          <div
            role="toolbar"
            aria-label="Post editor toolbar"
            className="flex min-w-max items-center gap-1 p-2"
          >
            <ToolbarButton
              label="Undo"
              shortcut="Ctrl+Z"
              onClick={() => runCommand(() => editor.commands.undo())}
              disabled={!toolbarState.canUndo}
            >
              <Undo2 />
            </ToolbarButton>
            <ToolbarButton
              label="Redo"
              shortcut="Ctrl+Y"
              onClick={() => runCommand(() => editor.commands.redo())}
              disabled={!toolbarState.canRedo}
            >
              <Redo2 />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
              label="Bold"
              shortcut="Ctrl+B"
              onClick={() => runCommand(() => editor.commands.toggleBold())}
              isActive={toolbarState.isBold}
              disabled={!toolbarState.canBold}
            >
              <Bold />
            </ToolbarButton>
            <ToolbarButton
              label="Italic"
              shortcut="Ctrl+I"
              onClick={() => runCommand(() => editor.commands.toggleItalic())}
              isActive={toolbarState.isItalic}
              disabled={!toolbarState.canItalic}
            >
              <Italic />
            </ToolbarButton>
            <ToolbarButton
              label="Underline"
              shortcut="Ctrl+U"
              onClick={() => runCommand(() => editor.commands.toggleUnderline())}
              isActive={toolbarState.isUnderline}
              disabled={!toolbarState.canUnderline}
            >
              <Underline />
            </ToolbarButton>
            <ToolbarButton
              label="Strikethrough"
              onClick={() => runCommand(() => editor.commands.toggleStrike())}
              isActive={toolbarState.isStrike}
              disabled={!toolbarState.canStrike}
            >
              <Strikethrough />
            </ToolbarButton>
            <ToolbarButton
              label="Inline code"
              onClick={() => runCommand(() => editor.commands.toggleCode())}
              isActive={toolbarState.isCode}
              disabled={!toolbarState.canCode}
            >
              <Code2 />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
              label="Paragraph"
              onClick={() => runCommand(() => editor.commands.setParagraph())}
              isActive={toolbarState.isParagraph}
              disabled={!toolbarState.canParagraph}
            >
              <Pilcrow />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 2"
              onClick={() =>
                runCommand(() => editor.commands.toggleHeading({ level: 2 }))
              }
              isActive={toolbarState.isHeading2}
              disabled={!toolbarState.canHeading2}
            >
              <Heading2 />
            </ToolbarButton>
            <ToolbarButton
              label="Heading 3"
              onClick={() =>
                runCommand(() => editor.commands.toggleHeading({ level: 3 }))
              }
              isActive={toolbarState.isHeading3}
              disabled={!toolbarState.canHeading3}
            >
              <Heading3 />
            </ToolbarButton>
            <ToolbarButton
              label="Blockquote"
              onClick={() => runCommand(() => editor.commands.toggleBlockquote())}
              isActive={toolbarState.isBlockquote}
              disabled={!toolbarState.canBlockquote}
            >
              <Quote />
            </ToolbarButton>
            <ToolbarButton
              label="Code block"
              onClick={() => runCommand(() => editor.commands.toggleCodeBlock())}
              isActive={toolbarState.isCodeBlock}
              disabled={!toolbarState.canCodeBlock}
            >
              <Code2 />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
              label="Bulleted list"
              onClick={() =>
                runCommand(() => editor.commands.toggleList({ kind: 'bullet' }))
              }
              isActive={toolbarState.isBulletList}
              disabled={!toolbarState.canBulletList}
            >
              <List />
            </ToolbarButton>
            <ToolbarButton
              label="Ordered list"
              onClick={() =>
                runCommand(() => editor.commands.toggleList({ kind: 'ordered' }))
              }
              isActive={toolbarState.isOrderedList}
              disabled={!toolbarState.canOrderedList}
            >
              <ListOrdered />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <AddLinkDialog
              editor={editor}
              disabled={!toolbarState.canAddLink}
            />
            <ToolbarButton
              label="Remove link"
              onClick={() => runCommand(() => editor.commands.removeLink())}
              isActive={toolbarState.isLink}
              disabled={!toolbarState.canRemoveLink}
            >
              <Link2Off />
            </ToolbarButton>
            <AddImageDialog
              editor={editor}
              disabled={!toolbarState.canInsertImage}
            />
            <ToolbarButton
              label="Insert divider"
              onClick={() =>
                runCommand(() => editor.commands.insertHorizontalRule())
              }
              disabled={!toolbarState.canInsertRule}
            >
              <Minus />
            </ToolbarButton>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <ToolbarButton
              label="Clear formatting"
              onClick={clearFormatting}
              disabled={!toolbarState.canClearFormatting}
            >
              <Eraser />
            </ToolbarButton>
          </div>
        </ScrollArea>

        <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground">
          Use markdown-style shortcuts while typing: <strong>#</strong> headings, <strong>&gt;</strong> quotes, and <strong>-</strong> lists.
        </div>
      </div>
    </TooltipProvider>
  )
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
    <div
      className={cn(
        'space-y-3 rounded-xl border border-border bg-background p-3',
        className,
      )}
    >
      <ProseKit editor={editor}>
        <EditorToolbar editor={editor} />
        <ChangeBridge
          editor={editor}
          serializedRef={serializedRef}
          onChange={onChange}
        />
        <div
          ref={editor.mount}
          className={cn(
            'prose prose-sm dark:prose-invert max-w-none min-h-[420px] rounded-md border border-border bg-card p-4',
            '[&_.ProseMirror]:min-h-[388px] [&_.ProseMirror]:outline-none',
          )}
        />
      </ProseKit>
    </div>
  )
}
