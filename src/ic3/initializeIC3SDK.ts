import { TelemetryEvents } from '../types/ic3/TelemetryEvents';
import getSDKFromURL from './getSDKFromURL';

let _sdk: Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK | null = null;
let _sdkInfo: any;

export default async function initializeIC3SDK(
  sdkURL: string | undefined,
  options: Microsoft.CRM.Omnichannel.IC3Client.Model.IClientSDKInitializationParameters,
  sessionInfo: Microsoft.CRM.Omnichannel.IC3Client.Model.IInitializationInfo
): Promise<Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK> {
  // TODO: The original code will always re-initialize on every call to this function.
  //       Looks like it does not make sense to cache the result because it always initialize.
  _sdkInfo = {
    sdkUrl: sdkURL,
    options: options,
    sessionInfo: sessionInfo
  };
  try{
    if (!sessionInfo.token) {
      options?.logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
        { Event: TelemetryEvents.CHAT_TOKEN_NOT_FOUND, 
          Description: `Adapter: chatToken must be specified`
        });
      throw new Error('chatToken must be specified.');
    }
    const sdk = await getSDKFromURL(sdkURL, options);
    options?.logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      { Event: TelemetryEvents.IC3_SDK_INITIALIZE_STARTED, 
         Description: `Adapter: No conversation found; initializing IC3 SDK`
      }
    );
    await sdk.initialize(sessionInfo);
    options?.logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.DEBUG,
      {
        Event: TelemetryEvents.IC3_SDK_INITIALIZE_SUCCESS,
        Description: `Adapter: IC3 SDK initialization success`
      }
    );
    _sdk = sdk;
  } catch(error){
    _sdk = null;
    options?.logger?.logClientSdkTelemetryEvent(Microsoft.CRM.Omnichannel.IC3Client.Model.LogLevel.ERROR,
      {
        Event: TelemetryEvents.IC3_SDK_INITIALIZE_FAILURE,
        Description: `Adapter: IC3 SDK initialization failure`
      }
    );
    throw error;
  }

  return _sdk;
}
export function getSdk(): Microsoft.CRM.Omnichannel.IC3Client.Model.ISDK | null {
  return _sdk;
}

export function getParams(): any {
  return _sdkInfo;
}