"use client"

import {
  Panel as ResizablePanel,
  PanelGroup as ResizablePanelGroup,
  PanelResizeHandle as ResizableHandlePrimitive,
} from "react-resizable-panels"

import { cn } from "@/utils/helpers";

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizableHandlePrimitive> & {
  withHandle?: boolean
}) => (
  <ResizableHandlePrimitive
    className={cn(
      "relative flex w-px items-center justify-center bg-gray-200 after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-1 focus-visible:ring-offset-gray-100",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-gray-100">
        <div className="h-2 w-1 rounded-full bg-gray-400" />
      </div>
    )}
  </ResizableHandlePrimitive>
)

export { ResizablePanel, ResizablePanelGroup, ResizableHandle } 