'use client';

import React, { useEffect } from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Custom Link component that triggers NProgress
type CustomLinkProps = NextLinkProps & {
  children: React.ReactNode;
  className?: string;
  title?: string;
};

export function Link({ href, ...props }: CustomLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.toString() !== pathname) {
      NProgress.start();
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return <NextLink href={href} {...props} onClick={handleClick} />;
}


export function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
} 