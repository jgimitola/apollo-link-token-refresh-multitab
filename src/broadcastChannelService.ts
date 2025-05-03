export type TokenRefreshMessage = {
  type: "token-refreshed" | "token-refresh-started" | "token-refresh-failed";
  payload?: any;
};

export class BroadcastChannelService {
  private static instance: BroadcastChannelService;
  private channel: BroadcastChannel;
  private listeners: ((event: MessageEvent<TokenRefreshMessage>) => void)[] =
    [];

  private constructor() {
    this.channel = new BroadcastChannel("token-refresh");
    this.channel.onmessage = (event) => {
      this.listeners.forEach((listener) => listener(event));
    };
  }

  public static getInstance(): BroadcastChannelService {
    if (!BroadcastChannelService.instance) {
      BroadcastChannelService.instance = new BroadcastChannelService();
    }
    return BroadcastChannelService.instance;
  }

  public addListener(
    listener: (event: MessageEvent<TokenRefreshMessage>) => void
  ): void {
    this.listeners.push(listener);
  }

  public postMessage(message: TokenRefreshMessage): void {
    this.channel.postMessage(message);
  }

  public close(): void {
    this.channel.close();
  }
}
