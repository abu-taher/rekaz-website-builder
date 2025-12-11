import type { Metadata } from 'next';
import { PreviewContent } from './PreviewContent';

export const metadata: Metadata = {
  title: 'Preview - Rekaz Website Builder',
  description: 'Preview your website built with Rekaz Website Builder',
};

export default function PreviewPage() {
  return <PreviewContent />;
}
