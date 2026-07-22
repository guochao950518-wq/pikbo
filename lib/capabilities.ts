export type CapabilityStatus = "live" | "validation" | "comingSoon";

export type CapabilityDefinition = {
  id: string;
  label: string;
  status: CapabilityStatus;
  publicNote: string;
};

export const CAPABILITIES = {
  toyImageToVideo: {
    id: "toy-image-to-video",
    label: "Toy image to video",
    status: "validation",
    publicNote: "Private validation available · live calls need a provider key.",
  },
  asyncJobs: {
    id: "async-generation-jobs",
    label: "Trackable generation jobs",
    status: "live",
    publicNote: "Tasks keep a stable status and support retry without double charging.",
  },
  multiReference: {
    id: "multi-reference",
    label: "Multi-reference consistency",
    status: "comingSoon",
    publicNote: "Extra angles are saved with the project but are not presented as model inputs yet.",
  },
  batchCampaigns: {
    id: "sku-campaigns",
    label: "SKU campaigns",
    status: "validation",
    publicNote: "Campaign configuration and queue recovery can be validated without provider spend.",
  },
  cleanDownloads: {
    id: "clean-downloads",
    label: "Clean paid downloads",
    status: "comingSoon",
    publicNote: "Billing remains disabled during private product validation.",
  },
} satisfies Record<string, CapabilityDefinition>;
