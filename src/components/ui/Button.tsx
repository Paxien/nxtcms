import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef, Ref } from 'react'
import { cn } from '@/lib/utils'

type ButtonBaseProps = {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button'
  }

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: 'a'
  }

type ButtonProps = ButtonAsButton | ButtonAsAnchor

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', as = 'button', ...props }, ref) => {
    const baseStyles = cn(
      'inline-flex items-center justify-center rounded-md font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      }[variant],
      {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-4 py-2',
        lg: 'h-11 px-8 text-lg',
      }[size],
      className
    )

    if (as === 'a') {
      return <a className={baseStyles} {...(props as ButtonAsAnchor)} ref={ref as Ref<HTMLAnchorElement>} />
    }

    return <button className={baseStyles} {...(props as ButtonAsButton)} ref={ref as Ref<HTMLButtonElement>} />
  }
)
Button.displayName = 'Button'

export { Button, type ButtonProps }
