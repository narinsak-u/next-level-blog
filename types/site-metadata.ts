import { z } from "zod";

const CreditSchema = z.object({
  text: z.string(),
  url: z.string().url().optional().or(z.string().length(0)),
});

const BannerCreditSchema = z.object({
  credit: CreditSchema,
});

const CreditsSchema = z.object({
  banner: BannerCreditSchema,
});

const SocialsSchema = z.object({
  x: z.string().url(),
  steam: z.string().url(),
});

const SiteMetadataSchema = z.object({
  metadataBase: z.instanceof(URL),
  homeTitle: z.string(),
  title: z.string(),
  description: z.string(),
  siteAddress: z.string().url(),
  author: z.string(),
  twitter: z.string(),
  github: z.string().url(),
  githubRepo: z.string().url(),
  keywords: z.array(z.string()),
  feedbackUrl: z.string().url(),
  version: z.string(),
  socials: SocialsSchema,
  credits: CreditsSchema,
});

export type SiteMetadataType = z.infer<typeof SiteMetadataSchema>;
export { SiteMetadataSchema };
