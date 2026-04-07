import headerFooterConfig from "./config";
import type { HeaderData } from "./services/server";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}

type UserMenu = NonNullable<HeaderData["usermenu"]>;
type EventTrackingAttributes = NonNullable<UserMenu["attributes"]>;

export interface CampaignsData {
  dataLayerObj: {
    dataLayerObjName: string;
    dataLayerObjProps: string[][];
  };
  MEOS_COUNT: string;
  MEOS_DATE: string;
  nboDataEvents: EventTrackingAttributes;
  rubiCampaignHTML: string;
}

export const resolveAppId = () => {
  return headerFooterConfig.ISites.Configurations.Header.AppID || headerFooterConfig.ISites.Configurations.AppId;
};

const appIdToSegment = (appId: string) => {
  switch (appId.toLowerCase()) {
    case "isitesconsumo":
    case "isitesconsumoen":
      return "meo";
    case "isitesmeoempresas":
      return "meoempresas";
    default:
      return appId;
  }
};

type HeaderConfig = typeof headerFooterConfig.ISites.Configurations.Header & {
  Segment?: string;
  RenderLang?: boolean;
  RenderC2C?: boolean;
};

export const resolveSegment = (appId: string) => {
  const headerConfig: HeaderConfig = headerFooterConfig.ISites.Configurations.Header;
  const siteName = headerFooterConfig.ISites.Configurations.Site?.Name;

  return siteName || headerConfig.Segment || appIdToSegment(appId);
};

export const resolveLogoutUrl = (appId: string) => {
  const headerConfig = headerFooterConfig.ISites.Configurations.Header;
  if (headerConfig.LogoutUrl && headerConfig.LogoutUrl.length > 0) {
    return headerConfig.LogoutUrl;
  }

  if (appId.startsWith("isell")) {
    return headerConfig.LogoutStoreUrl;
  }

  return headerConfig.LogoutUrl;
};

export const buildTaxonomyConfigs = () => {
  // TODO: Isites Config changed, simplify it and get rid of this "as" casting and type
  const { RenderLang = true, RenderC2C = true } = headerFooterConfig.ISites.Configurations.Header as HeaderConfig;

  return { renderLang: !!RenderLang, renderC2C: !!RenderC2C };
};

const applyLogoutScript = (userMenu: UserMenu, logoutUrl: string | undefined) => {
  if (!logoutUrl) {
    return userMenu;
  }

  const existingScript = userMenu.userMenuScript;
  if (existingScript && existingScript.length > 0 && existingScript.indexOf(logoutUrl) === -1) {
    //regex for url replacing, to test later
    const regex = /(document\.location\s*=\s*['"])https?:\/\/[^'"]+(['"])/i;
    userMenu.userMenuScript = existingScript.replace(regex, `$1${logoutUrl}$2`);
    return userMenu;
  }

  return userMenu;
};

interface TransformHeaderParams {
  headerData: HeaderData | undefined;
  user?: { Alias: string; IdPID: string; UserName: string };
}

export const transformHeader = ({ headerData, user }: TransformHeaderParams) => {
  if (!headerData) {
    return headerData;
  }

  pushUserDataLayer(user);

  const nextHeader = { ...headerData };
  const userMenu = nextHeader.usermenu ? { ...nextHeader.usermenu } : undefined;

  if (userMenu) {
    const appId = resolveAppId();
    const logoutUrl = resolveLogoutUrl(appId);
    const isAnon = !user;

    userMenu.isAnon = isAnon;
    applyLogoutScript(userMenu, logoutUrl);

    //additional user props - username and photo
    let userPicUrl = "";

    //additional user props - user photo and user name when logged in with fb, only for consumer
    if (!isAnon && appId.indexOf("empresas") === -1) {
      const authProvider = user?.IdPID ?? "";
      const authUserId = user?.Alias ?? "";

      //only set the photo if the userid is numeric
      if (authProvider === "FACEBOOK" && authUserId && !isNaN(+authUserId)) {
        userPicUrl = format(headerFooterConfig.ISites.Configurations.Header.UserPicFormatFacebook, authUserId);
      }
    }

    userMenu.userPhoto = userPicUrl;
    userMenu.userName = user?.UserName ?? "";

    //anon user - push login
    if (isAnon) {
      const anonCookieName = "MEOAnonCampaign";
      const headerConfig = headerFooterConfig.ISites.Configurations.Header;
      let pushLoginTime: number | null = null;
      let pushDelayTime: number | null = null;
      let rubiCampaignHTML = "";

      if (headerConfig.PushLogin) {
        const anonCookie = readCookie(anonCookieName);
        if (!anonCookie) {
          const isDesktop = !mobileAndTabletcheck();
          const dtPushLogin = headerConfig.PushLoginPopupDesktop ?? false;
          const mbPushLogin = headerConfig.PushLoginPopupMobile ?? false;
          const pushShowTime =
            (isDesktop
              ? (headerConfig.PushLoginPopupDesktopShowTime ?? 12)
              : (headerConfig.PushLoginPopupMobileShowTime ?? 12)) * 1000;
          const pushCookieExpire = isDesktop
            ? (headerConfig.PushLoginDesktopCookieExpiration ?? 24)
            : (headerConfig.PushLoginMobileCookieExpiration ?? 24);

          //novo AG 20241120 - valor para delay de exibir o popup
          pushDelayTime =
            (isDesktop
              ? (headerConfig.PushLoginDesktopDelayTime ?? 0)
              : (headerConfig.PushLoginPopupMobileDelayTime ?? 0)) * 1000;

          if ((isDesktop && dtPushLogin) || (!isDesktop && mbPushLogin)) {
            //novo AG 20241107
            //check for localstorage flag, set on QuantCastTag_MEO.js
            //if flag exists and true, we assume consent was already given, the modal is not shown and we can show the push login
            try {
              if (window.localStorage.consentGiven && window.localStorage.consentGiven == "true") {
                //ok to show push login, set the variables
                pushLoginTime = pushShowTime;
                createCookie(anonCookieName, 1, pushCookieExpire);
              } else {
                pushLoginTime = null;
                pushDelayTime = null;
                rubiCampaignHTML = "";
              }
            } catch {
              // ignore
            }
          }
        }
      }

      userMenu.pushLoginTime = pushLoginTime;
      userMenu.pushDelayTime = pushDelayTime;
      userMenu.rubiCampaignHTML = rubiCampaignHTML;
    }

    nextHeader.usermenu = userMenu;
  }

  return nextHeader;
};

interface TransformCampaignsParams {
  headerData: HeaderData | undefined;
  campaigns: CampaignsData | undefined;
}

export const transformCampaigns = ({ headerData, campaigns }: TransformCampaignsParams) => {
  if (!headerData || !campaigns || typeof campaigns !== "object") {
    return headerData;
  }

  pushCampaignDataLayer(campaigns);

  const nextHeader = { ...headerData };
  const userMenu = nextHeader.usermenu ? { ...nextHeader.usermenu } : undefined;

  if (userMenu) {
    const isDesktop = !mobileAndTabletcheck();
    const headerConfig = headerFooterConfig.ISites.Configurations.Header;

    const authCookieName = "MEOAuthCampaign";
    let pullBannerTime: number | null = null;
    let pullDelayTime: number | null = null;

    if (headerConfig.PullBanner) {
      //read the cookie
      const authCookie = readCookie(authCookieName);
      //if cookie does not exist, check display mode and if push login is enabled for it
      if (!authCookie) {
        const dtPullBanner = headerConfig.PullBannerPopupDesktop ?? false;
        const mbPullBanner = headerConfig.PullBannerPopupMobile ?? false;
        const pullShowTime =
          (isDesktop
            ? (headerConfig.PullBannerPopupDesktopShowTime ?? 12)
            : (headerConfig.PullBannerPopupMobileShowTime ?? 12)) * 1000;
        const pullCookieExpire = isDesktop
          ? (headerConfig.PullBannerDesktopCookieExpiration ?? 24)
          : (headerConfig.PullBannerMobileCookieExpiration ?? 24);

        //novo AG 20241120 - valor para delay de exibir o popup
        pullDelayTime =
          (isDesktop ? (headerConfig.PullBannerDesktopDelayTime ?? 0) : (headerConfig.PullBannerMobileDelayTime ?? 0)) *
          1000;

        if ((isDesktop && dtPullBanner) || (!isDesktop && mbPullBanner)) {
          try {
            if (window.localStorage.consentGiven && window.localStorage.consentGiven == "true") {
              pullBannerTime = pullShowTime;
              //set anon cookie for next visit, with value 1 and with expiration of X hours
              createCookie(authCookieName, "1", pullCookieExpire);
            }
          } catch {
            // ignore
          }
        }
      }
    }

    userMenu.pullBannerTime = pullBannerTime;
    userMenu.pullDelayTime = pullDelayTime;
    userMenu.rubiCampaignHTML = campaigns.rubiCampaignHTML ?? "";

    let nboDataEvents: EventTrackingAttributes = {};
    if (isEmpty(nboDataEvents) && campaigns.nboDataEvents) {
      nboDataEvents = campaigns.nboDataEvents;
    }

    userMenu.attributes = nboDataEvents;
    nextHeader.usermenu = userMenu;
  }

  //update meos info on the object with the props from the response
  if (nextHeader.meos) {
    const meos = { ...nextHeader.meos };
    if (campaigns.MEOS_COUNT) {
      meos.MEOS_COUNT = campaigns.MEOS_COUNT;
    }

    if (campaigns.MEOS_DATE) {
      meos.MEOS_DATE = campaigns.MEOS_DATE;
    }

    nextHeader.meos = meos;
  }

  return nextHeader;
};

export const pushUserDataLayer = (user: { UserName: string } | undefined) => {
  if (typeof window === "undefined" || !window.dataLayer) return;

  window.dataLayer.push({ username: user?.UserName ?? "" });
  window.dataLayer.push({ userauth: !!user });
};

export const pushCampaignDataLayer = (campaigns: CampaignsData | undefined) => {
  if (typeof window === "undefined" || !campaigns || !window.dataLayer) return;

  const dlObj = campaigns.dataLayerObj;
  if (dlObj?.dataLayerObjName && dlObj.dataLayerObjProps) {
    window.dataLayer.push({ [dlObj.dataLayerObjName]: dlObj.dataLayerObjProps });
  }
};

const format = (str: string, ...args: string[]): string => {
  return str.replace(/{(\d+)}/g, (match, index) => {
    return typeof args[index] !== "undefined" ? (args[index] as string) : match;
  });
};

// TODO: this should probably use the next.js cookie API but fuck it honestly
const readCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c?.charAt(0) == " ") c = c.substring(1, c.length);
    if (c?.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const createCookie = (name: string, value: unknown, hours: number) => {
  if (typeof document === "undefined") return;
  const expires = hours ? `; expires=${new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString()}` : "";
  const domain = GetMainDomain();
  document.cookie = `${name}=${value}${expires}; domain=${domain}; path=/`;
};

const GetMainDomain = () => {
  if (typeof window === "undefined") return "";
  const tmpUrl = window.location.hostname;
  if (tmpUrl && tmpUrl.length > 0) {
    const hostParts = tmpUrl.split(".");
    const numParts = hostParts.length;
    if (numParts > 2) {
      return format("{0}.{1}", hostParts[numParts - 2] ?? "", hostParts[numParts - 1] ?? "");
    } else {
      return "";
    }
  }
};

const mobileAndTabletcheck = () => {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;

  let check = false;
  ((a) => {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

const isEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
