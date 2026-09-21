import { z } from 'zod';

export const getPlayerProfileSchema = z.object({
  params: z.object({
    name: z
      .string()
      .min(3, 'Riot ID phải có ít nhất 3 ký tự')
      .max(16, 'Riot ID tối đa 16 ký tự'),
    tag: z
      .string()
      .min(3, 'Tagline phải có ít nhất 3 ký tự')
      .max(5, 'Tagline tối đa 5 ký tự')
      .transform((val) => val.replace('#', '')), // Tự động xóa dấu # nếu người dùng nhập vào
  }),
});

export type GetPlayerProfileInput = z.infer<typeof getPlayerProfileSchema>;