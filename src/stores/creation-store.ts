"use client";
import { create } from "zustand";
import type { PhotoStyle } from "@/types/preset";
import type { UploadSlot, UploadedImage, SceneSelection } from "@/types/upload";
import type { GenerationResult, GenerationStatus } from "@/types/generation";

interface CreationState {
  // Step tracking
  currentStep: 1 | 2 | 3;

  // Step 1: Upload
  referenceImages: Record<string, UploadedImage | undefined>; // keyed by slot: headshot, halfbody, fullbody

  // Step 2: Customize
  scene: SceneSelection | null;
  inspirationImage: UploadedImage | null;
  style: PhotoStyle;
  outfit: string | null;
  mood: string | null;
  photoCount: number;
  model: 'pro' | 'nb2';
  abTest: boolean;

  // Step 3: Generation
  sessionId: string | null;
  generatedPhotos: GenerationResult[];
  generationStatus: GenerationStatus;
  currentPhotoIndex: number;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  addReferenceImage: (slot: UploadSlot, image: UploadedImage) => void;
  removeReferenceImage: (slot: UploadSlot) => void;
  setScene: (scene: SceneSelection) => void;
  setInspirationImage: (image: UploadedImage | null) => void;
  setStyle: (style: PhotoStyle) => void;
  setOutfit: (outfit: string | null) => void;
  setMood: (mood: string | null) => void;
  setPhotoCount: (count: number) => void;
  setModel: (model: 'pro' | 'nb2') => void;
  setAbTest: (abTest: boolean) => void;
  applyPackage: (sceneId: string, styleId: PhotoStyle, outfitId: string, moodId: string) => void;
  startGeneration: (sessionId: string) => void;
  addGeneratedPhoto: (result: GenerationResult) => void;
  setGenerationStatus: (status: GenerationStatus) => void;
  setCurrentPhotoIndex: (index: number) => void;
  reset: () => void;
}

const initialState = {
  currentStep: 1 as const,
  referenceImages: {},
  scene: null,
  inspirationImage: null as UploadedImage | null,
  style: "influencer" as PhotoStyle,
  outfit: null,
  mood: null,
  photoCount: 4,
  model: 'nb2' as const,
  abTest: false,
  sessionId: null,
  generatedPhotos: [],
  generationStatus: "idle" as GenerationStatus,
  currentPhotoIndex: 0,
};

export const useCreationStore = create<CreationState>((set) => ({
  ...initialState,

  setStep: (step) => set({ currentStep: step }),

  addReferenceImage: (slot, image) => set((state) => ({
    referenceImages: { ...state.referenceImages, [slot]: image },
  })),

  removeReferenceImage: (slot) => set((state) => {
    const { [slot]: _, ...rest } = state.referenceImages;
    return { referenceImages: rest };
  }),

  setScene: (scene) => set({ scene }),

  setInspirationImage: (image) => set(image
    ? { inspirationImage: image, scene: null, outfit: null, mood: null } // mutually exclusive with manual settings
    : { inspirationImage: null },
  ),

  setStyle: (style) => set({ style }),
  setOutfit: (outfit) => set({ outfit }),
  setMood: (mood) => set({ mood }),
  setPhotoCount: (count) => set({ photoCount: Math.max(1, Math.min(8, count)) }),
  setModel: (model) => set({ model }),
  setAbTest: (abTest) => set({ abTest }),

  applyPackage: (sceneId, styleId, outfitId, moodId) => set({
    scene: { type: "preset", presetId: sceneId },
    style: styleId,
    outfit: outfitId,
    mood: moodId,
    inspirationImage: null, // mutually exclusive with inspiration mode
  }),

  startGeneration: (sessionId) => set({
    sessionId,
    generatedPhotos: [],
    generationStatus: "generating",
    currentPhotoIndex: 0,
  }),

  addGeneratedPhoto: (result) => set((state) => ({
    generatedPhotos: [...state.generatedPhotos, result],
  })),

  setGenerationStatus: (status) => set({ generationStatus: status }),
  setCurrentPhotoIndex: (index) => set({ currentPhotoIndex: index }),
  reset: () => set(initialState),
}));
