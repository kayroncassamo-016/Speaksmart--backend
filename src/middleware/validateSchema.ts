import type { NextFunction, Request, Response } from 'express'
import { ZodError, type ZodType } from 'zod'

export const validateSchema = (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      })

      return next()
    } catch (error) {
      if (error instanceof ZodError) {
      const details = error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }))

      return res.status(400).json({
        error: "Validation error",
        message: details[0]?.message ?? "Invalid request",
        details,
      })
    }

      return res.status(500).json({
        error: 'Internal server error'
      })
    }
  }