import { readFile } from "fs/promises";
import * as path from "path";
import { IEmailAPI } from "../apis/emailAPI";
import { ApplicationContext } from "../types";
import { logger } from "../util/logger";
import { RollbarService } from "./rollbarService";
import { traced } from "./telemetryService";

/**
 * Responsible for sending emails to users.
 */
export class EmailService {
  private context: ApplicationContext;
  private rollbarService: RollbarService | null;
  private emailAPI: IEmailAPI | null;

  public constructor(
    context: ApplicationContext,
    rollbarService: RollbarService | null,
    emailClient: IEmailAPI | null
  ) {
    this.context = context;
    this.rollbarService = rollbarService;
    this.emailAPI = emailClient;
  }

  private async composePretixEmail(
    name: string,
    token: string
  ): Promise<{ text: string; html: string }> {
    const textTemplate = (
      await readFile(
        path.join(this.context.resourcesDir, "email/zupass/email.txt")
      )
    ).toString();
    const htmlTemplate = (
      await readFile(
        path.join(this.context.resourcesDir, "email/zupass/email.html")
      )
    ).toString();

    const text = textTemplate
      .replace("{{name}}", name)
      .replace("{{token}}", token);

    const html = htmlTemplate
      .replace("{{name}}", name)
      .replace("{{token}}", token);

    return {
      text,
      html
    };
  }

  private async composeGenericEmail(
    token: string
  ): Promise<{ text: string; html: string }> {
    const textTemplate = (
      await readFile(
        path.join(this.context.resourcesDir, "email/pcdpass/email.txt")
      )
    ).toString();
    const htmlTemplate = (
      await readFile(
        path.join(this.context.resourcesDir, "email/pcdpass/email.html")
      )
    ).toString();

    const text = textTemplate.replace("{{token}}", token);
    const html = htmlTemplate.replace("{{token}}", token);

    return {
      text,
      html
    };
  }

  public async sendPretixEmail(
    to: string,
    name: string,
    token: string
  ): Promise<void> {
    return traced("Email", "sendEmail", async (span) => {
      span?.setAttribute("email", to);

      const msg = {
        to: to,
        from: "passport@0xparc.org",
        subject: "Welcome to your Zuzalu Passport",
        ...(await this.composePretixEmail(name, token))
      };

      try {
        if (!this.emailAPI) {
          throw new Error("[EMAIL] no email client");
        }
        await this.emailAPI.send(msg);
      } catch (e) {
        logger(e);
        this.rollbarService?.reportError(e);
        throw new Error(`Email send error, failed to email ${to}`, {
          cause: e
        });
      }
    });
  }

  public async sendPCDpassEmail(to: string, token: string): Promise<void> {
    return traced("Email", "sendEmail", async (span) => {
      span?.setAttribute("email", to);

      const msg = {
        to: to,
        from: "passport@0xparc.org",
        subject: "Welcome to PCDpass",
        ...(await this.composeGenericEmail(token))
      };

      try {
        if (!this.emailAPI) {
          throw new Error("[EMAIL] no email client");
        }

        this.emailAPI.send(msg);
      } catch (e) {
        logger(e);
        this.rollbarService?.reportError(e);
        throw (
          (new Error(`Email send error, failed to email ${to}`), { cause: e })
        );
      }
    });
  }
}

export function startEmailService(
  context: ApplicationContext,
  rollbarService: RollbarService | null,
  emailClient: IEmailAPI | null
): EmailService {
  const emailService = new EmailService(context, rollbarService, emailClient);
  return emailService;
}
