# Prompt Architect: Visual DNA Engineering Studio

Prompt Architect is a high-fidelity AI studio designed to deconstruct, engineer, and remix visual aesthetics. Powered by Google's Gemini 3 models, it allows users to map the "visual DNA" of any image and apply it to their own photography with subject-locked precision.

##  Architecture Overview

The application follows a modular, state-driven React architecture designed for high performance and clean separation of concerns.

###  Core Concepts
- **Visual DNA**: The combination of prompt structures and visual markers (attributes) that define an image's aesthetic.
- **Identity Anchoring**: A specialized prompting technique used in the Remix engine to ensure subjects (like people or celebrities) remain 100% recognizable while only the atmosphere shifts.
- **Mode-Based Routing**: A lightweight state-driven router that handles transitions between Deconstruct, Construct, Remix, and Feed modes.

###  Modular Structure
- `App.tsx`: The primary orchestrator handling global state, mode routing, and layout.
- `components/`: A dedicated library of specific, reusable components.
  - `Navbar.tsx`: Unified navigation with theme and repository integration.
  - `Footer.tsx`: Standardized site-wide footer.
  - `HomeHero.tsx`: High-impact landing page section.
  - `DeconstructSection.tsx`: Interface for reverse-engineering image prompts.
  - `ConstructSection.tsx`: Interface for high-fidelity image synthesis.
  - `RemixSection.tsx`: Advanced studio for subject-locked style transfer.
  - `CommunityFeed.tsx`: Social discovery layer for visual DNA.
  - `LibrarySection.tsx`: User's private vault for saved aesthetics.
  - `AestheticCard.tsx`: Reusable card for displaying prompts and images.
  - `SaveModal.tsx`: Contextual dialog for archiving and publishing creations.
- `services/gemini.ts`: Encapsulated logic for all AI operations (Analysis, Generation, Editing).
- `types.ts`: Centralized TypeScript interfaces for data consistency.

##  How to Use

### 1. Deconstruct (Reverse Engineering)
Upload any image that inspires you. The **Deconstruct** engine will analyze the image to extract a professional-grade prompt and specific visual markers (e.g., "Anamorphic Lens", "Golden Hour Lighting").

### 2. Archive & Publish
Found a style you love? Use the **Save** button to store it in your private library or publish it to the **Community Canvas** for others to adopt.

### 3. Remix (Identity-Locked Style Transfer)
Upload a "Target Photo" (like a selfie). The **Remix** engine applies the DNA markers from your current deconstruction onto your photo. It uses specialized guardrails to ensure your face and identity stay intact while the environment, lighting, and texture shift to match the reference.

### 4. Construct (Synthesis)
Use engineered prompts to generate entirely new images in 1K, 2K, or 4K resolution.

##  Tech Stack
- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS (with custom Glassmorphism and Variable Theme logic)
- **AI Backend**: Google Gemini 3 (Pro, Flash, and Image Preview)
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Playfair Display (Serif), Inter (Sans-serif)