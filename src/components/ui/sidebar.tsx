"use client"

import * as React from "react"
import { PanelLeft } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "4.5rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
    state: "expanded" | "collapsed"
    open: boolean
    setOpen: (open: boolean) => void
    openMobile: boolean
    setOpenMobile: (open: boolean) => void
    isMobile: boolean
    toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.")
    }

    return context
}

const SidebarProvider = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        defaultOpen?: boolean
        open?: boolean
        onOpenChange?: (open: boolean) => void
    }
>(
    (
        {
            defaultOpen = true,
            open: openProp,
            onOpenChange: setOpenProp,
            className,
            style,
            children,
            ...props
        },
        ref
    ) => {
        const isMobile = useIsMobile()
        const [openMobile, setOpenMobile] = React.useState(false)

        // This is the internal state of the sidebar.
        // We use openProp and setOpenProp for control from outside the component.
        const [_open, _setOpen] = React.useState(defaultOpen)
        const open = openProp ?? _open
        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                const openState = typeof value === "function" ? value(open) : value
                if (setOpenProp) {
                    setOpenProp(openState)
                } else {
                    _setOpen(openState)
                }

                // This sets the cookie to keep the sidebar state.
                document.cookie = `sidebar:state=${openState}; path=/; max-age=${60 * 60 * 24 * 7
                    }`
            },
            [setOpenProp, open]
        )

        // Helper to toggle the sidebar.
        const toggleSidebar = React.useCallback(() => {
            return isMobile
                ? setOpenMobile((prev) => !prev)
                : setOpen((prev) => !prev)
        }, [isMobile, setOpen, setOpenMobile])

        // Adds a keyboard shortcut to toggle the sidebar.
        React.useEffect(() => {
            const handleKeyDown = (event: KeyboardEvent) => {
                if (
                    event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                    (event.metaKey || event.ctrlKey)
                ) {
                    event.preventDefault()
                    toggleSidebar()
                }
            }

            window.addEventListener("keydown", handleKeyDown)
            return () => window.removeEventListener("keydown", handleKeyDown)
        }, [toggleSidebar])

        // We add a state so that we can use it to style components based on the sidebar state.
        const state = open ? "expanded" : "collapsed"

        const contextValue = React.useMemo<SidebarContext>(
            () => ({
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar,
            }),
            [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
        )

        return (
            <SidebarContext.Provider value={contextValue}>
                <div
                    style={
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn(
                        "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            </SidebarContext.Provider>
        )
    }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div"> & {
        side?: "left" | "right"
        variant?: "sidebar" | "floating" | "inset"
        collapsible?: "offcanvas" | "icon" | "none"
    }
>(
    (
        {
            side = "left",
            variant = "sidebar",
            collapsible = "offcanvas",
            className,
            children,
            ...props
        },
        ref
    ) => {
        const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

        if (collapsible === "none") {
            return (
                <div
                    className={cn(
                        "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            )
        }

        if (isMobile) {
            return (
                <>
                    {/* Mobile Drawer Overlay */}
                    {openMobile && (
                        <div
                            className="fixed inset-0 z-[9998] bg-navy/50 md:hidden transition-opacity"
                            onClick={() => setOpenMobile(false)}
                        />
                    )}
                    <div
                        className={cn(
                            "fixed inset-y-0 left-0 z-[9999] w-[--sidebar-width-mobile] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden",
                            openMobile ? "translate-x-0" : "-translate-x-full",
                            className
                        )}
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)', transform: 'translate3d(0, 0, 0)' }}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </div>
                </>
            )
        }

        return (
            <div
                ref={ref}
                className="group peer hidden md:block text-sidebar-foreground"
                data-state={state}
                data-collapsible={state === "collapsed" ? collapsible : ""}
                data-variant={variant}
                data-side={side}
            >
                {/* This is what handles the sidebar gap on desktop */}
                <div
                    style={{ width: state === "collapsed" ? (collapsible === "offcanvas" ? '0px' : 'var(--sidebar-width-icon)') : 'var(--sidebar-width)' }}
                    className={cn(
                        "duration-300 relative h-svh bg-transparent transition-[width] ease-in-out",
                        "group-data-[side=right]:rotate-180"
                    )}
                />
                <div
                    style={{
                        width: state === "collapsed" && collapsible === "icon" ? 'var(--sidebar-width-icon)' : 'var(--sidebar-width)',
                        left: state === "collapsed" && collapsible === "offcanvas" && side === "left" ? 'calc(var(--sidebar-width) * -1)' : '0'
                    }}
                    className={cn(
                        "duration-300 fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] ease-in-out md:flex",
                        side === "right" && "right-0",
                        "group-data-[side=left]:border-r group-data-[side=right]:border-l",
                        className
                    )}
                    {...props}
                >
                    <div
                        data-sidebar="sidebar"
                        className="flex h-full w-full flex-col bg-white group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow overflow-hidden"
                    >
                        {children}
                    </div>
                </div>
            </div>
        )
    }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
        <button
            ref={ref}
            data-sidebar="trigger"
            className={cn("inline-flex items-center justify-center p-2 rounded-md hover:bg-slate-100 transition-colors", className)}
            onClick={(event) => {
                onClick?.(event)
                toggleSidebar()
            }}
            {...props}
        >
            <PanelLeft className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
        </button>
    )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-sidebar="content"
            className={cn(
                "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
                className
            )}
            {...props}
        />
    )
})
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-sidebar="header"
            className={cn("flex flex-col gap-2 p-2", className)}
            {...props}
        />
    )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
    HTMLDivElement,
    React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            data-sidebar="footer"
            className={cn("flex flex-col gap-2 p-2", className)}
            {...props}
        />
    )
})
SidebarFooter.displayName = "SidebarFooter"

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
    useSidebar,
}
