
import Link from 'next/link';
import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  logoPlaceholderClassName?: string;
  textClassName?: string;
  href?: string;
  imageUrl?: string | null; // Новый пропс для URL изображения
}

export function Logo({ className, logoPlaceholderClassName, textClassName, href = "/", imageUrl }: LogoProps) {
  const content = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Логотип RAREFIND"
          width={32} // Задайте подходящую ширину
          height={32} // Задайте подходящую высоту
          className={cn("object-contain", logoPlaceholderClassName)} // object-contain чтобы лого не обрезалось
        />
      ) : (
        <div 
          className={cn(
            "h-8 w-8 bg-muted border-2 border-dashed border-border flex items-center justify-center text-xs text-muted-foreground",
            logoPlaceholderClassName
          )}
          aria-label="Место для логотипа"
        >
          {/* Лого */}
        </div>
      )}
      <span className={cn("font-semibold text-xl text-foreground", textClassName)}>
        RAREFIND
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn("flex items-center gap-2", className)}>
        {content}
      </Link>
    );
  }

  return <div className={cn("flex items-center gap-2", className)}>{content}</div>;
}
