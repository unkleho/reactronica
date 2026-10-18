import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Headphones,
  LucideProps,
  VolumeX,
  X,
} from 'lucide-react';

// Every icon this app uses, named for what it means here rather than the
// underlying lucide component - keeps call sites readable and gives a single
// place to swap an icon (or the whole library) later.
const ICONS = {
  collapse: ChevronDown,
  expand: ChevronRight,
  mute: VolumeX,
  solo: Headphones,
  remove: X,
};

export type IconName = keyof typeof ICONS;

interface IconProps extends Omit<LucideProps, 'ref'> {
  name: IconName;
}

function Icon({ name, size = 14, ...props }: IconProps) {
  const LucideIcon = ICONS[name];

  return <LucideIcon size={size} {...props} />;
}

export default Icon;
