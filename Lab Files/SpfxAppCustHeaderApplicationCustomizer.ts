import { override } from '@microsoft/decorators';
import { Log, SPEventArgs } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SpfxAppCustHeaderApplicationCustomizerStrings';

const LOG_SOURCE: string = 'SpfxAppCustHeaderApplicationCustomizer';

import styles from './AppCustomizer.module.scss';
import { escape } from '@microsoft/sp-lodash-subset';
import { getHighContrastNoAdjustStyle } from '@uifabric/styling';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISpfxAppCustHeaderApplicationCustomizerProperties {
  // This is an example; replace with your own property
  Top: string;
  Bottom: string;
}

interface NavigationEventDetails extends Window {
  currentPage: string;
}

declare const window: NavigationEventDetails;
let pageurl: string;

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SpfxAppCustHeaderApplicationCustomizer
  extends BaseApplicationCustomizer<ISpfxAppCustHeaderApplicationCustomizerProperties> {

  private _topPlacehoder: PlaceholderContent | undefined;
  private _bottomPlacehoder: PlaceholderContent | undefined;



  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    this.context.application.navigatedEvent.add(this, this.navigationEventHandler);
    window.currentPage = window.location.href;
    let currentpage: string = window.currentPage;
    let arrycurrentpage = currentpage.split("?");
    pageurl = arrycurrentpage[0];

    if (pageurl == "https://jenkinskpmg.sharepoint.com/SitePages/Home.aspx") {
      this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolder);
    }


    return Promise.resolve();
  }
  private navigationEventHandler(args: SPEventArgs): void {
    setTimeout(() => {
      // Page URL check
      if (window.currentPage !== window.location.href) {
        window.currentPage = window.location.href;
      }
    }, 50);
  }

  private _renderPlaceHolder(): void {
    if (!this._topPlacehoder) {

      this._topPlacehoder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Top,
        { onDispose: this._onDispose }
      );

      if (this._topPlacehoder.domElement) {
        this._topPlacehoder.domElement.innerHTML = `
          <div class="${styles.app}">
          <div class="${styles.top}">
          <p>${pageurl}</p>
          </div></div>`;
      }
    }

    if (!this._bottomPlacehoder) {
      this._bottomPlacehoder = this.context.placeholderProvider.tryCreateContent(
        PlaceholderName.Bottom,
        { onDispose: this._onDispose }
      );

      if (this.properties) {
        let bottomString: string = this.properties.Bottom;
        if (!bottomString) {
          bottomString = "(bottom property was not defined)";
        }

        if (this._bottomPlacehoder.domElement) {
          this._bottomPlacehoder.domElement.innerHTML = `
          <div class="${styles.app}">
          <div class="${styles.bottom}">
          <p>${bottomString}</p>
          </div>
          </div>
          `;
        }
      }
    }
  }

  private _onDispose(): void {
    console.log('Dispose Method');
  }
}
