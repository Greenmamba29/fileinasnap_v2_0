### FileInASnap — Features and Components

- **Core value**: AI-powered photo organization with privacy-first architecture.

- **Primary features**
  - Smart AI Recognition: faces, objects, scenes, text
  - Auto‑Tagging and lightning‑fast search
  - Privacy by Design: local/on-device options and encrypted cloud
  - Family Sharing with granular permissions
  - Universal Import: Google Photos, iCloud, Dropbox, local drives
  - Memory Timeline with event grouping and milestones
  - Deduplication, burst grouping, export originals with metadata

- **UI components in `src/components/ui`**
  - Buttons, Cards, Badges, Tabs, Accordions, Dialogs, Sheets, Sidebar, Carousel, Table, Toast/Toaster, Tooltip, Menubar, Navigation‑menu, Select, Calendar, Progress, Slider, Skeleton, etc.
  - `AnimatedElements` exports: `FadeIn`, `StaggerContainer`, `FloatingCard`, `PhotoGalleryDemo`, `TimelineDemo`, `SearchDemo` for interactive demo sections.

- **Auth & Upload**
  - `AuthModal` for signup/signin flows
  - `upload/UploadModal` for file upload

- **Pages**
  - `DashboardPage` (protected)
  - `JournalPage`, `MemoryTimelinePage`, `SubscriptionPage`

- **Landing specifics**
  - Sticky header with scroll progress and section highlighting
  - Sections: Hero, Features, Differentiators, Security, Testimonials, Interactive Demo, Pricing, FAQ, Final CTA

- **Fonts used**
  - Inter (base), Poppins, Plus Jakarta Sans, Space Grotesk, Outfit

Use this as a reference when iterating on future sections and product pages.