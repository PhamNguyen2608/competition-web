import { Root } from '@radix-ui/react-portal'
import { cn } from '../lib/utils'
import React, { ComponentPropsWithoutRef, forwardRef, useState, useEffect } from 'react'

interface PortalProps {
  /**
   * Content sẽ hiển thị trong portal
   */
  children: React.ReactNode
  /**
   * Vị trí portal trong DOM (mặc định là document.body)
   */
  container?: HTMLElement | null
  /**
   * Có giữ lại children khi unmount không
   */
  preserveChildren?: boolean
}

const Portal = ({
  children,
  container,
  preserveChildren = false,
}: PortalProps) => (
  <Root
    container={container}
    className="portal-root"
    data-preserve-children={preserveChildren}
  >
    {children}
  </Root>
)

interface TriggerProps extends ComponentPropsWithoutRef<'button'> {
  asChild?: boolean
  onOpenChange?: (open: boolean) => void
}

const PortalTrigger = forwardRef<HTMLButtonElement, TriggerProps>(
  ({ children, asChild = false, onOpenChange, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
      const newState = !isOpen
      setIsOpen(newState)
      onOpenChange?.(newState)
    }

    return React.createElement(
      asChild ? React.Fragment : 'button',
      {
        ...(asChild ? {} : { 
          ref, 
          ...props, 
          onClick: handleClick,
          "data-portal-trigger": true,
          "aria-expanded": isOpen 
        }),
      },
      asChild ? React.cloneElement(children as React.ReactElement, {
        onClick: handleClick
      }) : children
    )
  }
)

interface ContentProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Có hiển thị overlay không
   */
  showOverlay?: boolean
  /**
   * Vị trí content relative với container
   */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  /**
   * Callback khi click outside
   */
  onClose?: () => void
}

const PortalContent = forwardRef<HTMLDivElement, ContentProps>(
  ({
    className,
    showOverlay = true,
    position = 'center',
    onClose,
    children,
    ...props
  }, ref) => {
    useEffect(() => {
      if (showOverlay) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      return () => {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
      };
    }, [showOverlay]);

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose?.();
      }
    };

    return (
      <>
        {showOverlay && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            data-portal-overlay
            onClick={handleOverlayClick}
          />
        )}
        <div
          ref={ref}
          className={cn(
            'fixed z-50',
            {
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2': position === 'center',
              'top-4 left-1/2 -translate-x-1/2': position === 'top',
              'bottom-4 left-1/2 -translate-x-1/2': position === 'bottom',
              'left-4 top-1/2 -translate-y-1/2': position === 'left',
              'right-4 top-1/2 -translate-y-1/2': position === 'right',
            },
            className
          )}
          data-portal-content
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

Portal.displayName = 'Portal'
PortalTrigger.displayName = 'PortalTrigger'
PortalContent.displayName = 'PortalContent'

const PortalComponent = { Portal, PortalTrigger, PortalContent }

export { Portal, PortalTrigger, PortalContent }
export default PortalComponent
