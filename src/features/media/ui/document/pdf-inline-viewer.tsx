interface PdfInlineViewerProps {
  src: string
  title: string
}

export function PdfInlineViewer({ src, title }: PdfInlineViewerProps) {
  return (
    <div className="bg-muted/30 h-full w-full">
      <iframe
        title={title}
        src={src}
        className="h-full min-h-[520px] w-full border-0"
      />
    </div>
  )
}
