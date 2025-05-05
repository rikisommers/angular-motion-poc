import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';

import { MatExpansionPanel } from '@angular/material/expansion';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  take,
  takeUntil,
} from 'rxjs/operators';
import { AppRouterState } from '../../store/router/app-router.state';
import { MenuEntryEntity, MenuEntryEntityFactory, RouteUrlValue } from './menuEntryEntity';
import { MenuItem } from '@src_shared/types/navigationMenu';
import { SideMenuService } from './sideMenu.service';
import { FeatureEnum } from '@src_shared/types/feature';

@Component({
  selector: 'menu-entry',
  templateUrl: './menuEntry.component.html',
})
export class MenuEntryComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  menuItem: MenuItem;

  @Input()
  parentMenuId: string;

  @Input()
  isUserAdmin: boolean;

  @Input()
  sideNavOpen: boolean;

  @ViewChild('menuPanel')
  menuPanel: MatExpansionPanel;

  isActive$: Observable<boolean>;
  isAmfPlusLicenced: boolean = false;

  myId: string;
  private ngUnsubscribe$ = new Subject<void>();
  private currentUrl$: Observable<RouteUrlValue>;
  private menuEntry$ = new BehaviorSubject<MenuEntryEntity>(null);
  private readonly reloadPath: string = '/loading';

  constructor(
      private sideMenuService: SideMenuService,
      private store: Store,
      private router: Router,
      private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
      if (changes['menuItem']) {
          this.menuEntry$.next(
              MenuEntryEntityFactory.create(
                  changes['menuItem'].currentValue,
                  this.parentMenuId,
              ),
          );
          this.isAmfPlusLicenced = this.showAMFPlusBadge(changes['menuItem'].currentValue);
      }
      if (changes['parentMenuId']) {
          this.menuEntry$.next(
              MenuEntryEntityFactory.create(
                  this.menuItem,
                  changes['parentMenuId'].currentValue,
              ),
          );
      }
  }

  ngOnInit() {
      this.myId = `${this.parentMenuId ? this.parentMenuId + '#' : ''}${
          this.menuItem.labelTranslationKey
      }`.toLowerCase();

      this.isAmfPlusLicenced = this.showAMFPlusBadge(this.menuItem);

      this.sideMenuService.isSideMenuHidden$
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe((isHidden) => {
              if (isHidden == true) {
                  if (this.menuPanel) {
                      this.menuPanel.close();
                  }
              }
          });
      this.currentUrl$ = AppRouterState.getUrl$(this.store).pipe(
          distinctUntilChanged(),
          filter((url) => !new RegExp(`^${this.reloadPath}`, 'i').test(url)), // skip some urls that are not part of menus
          map((url) => new RouteUrlValue(url)),
      );

      this.isActive$ = combineLatest(this.currentUrl$, this.menuEntry$).pipe(
          map(([currentUrl, menuEntry]) => menuEntry && menuEntry.isActive(currentUrl)),
          shareReplay(1),
      );
  }

  ngAfterViewInit(): void {
      this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
      this.ngUnsubscribe$.next();
      this.ngUnsubscribe$.complete();
  }

  async routeToLink(item: MenuItem, event?: MouseEvent): Promise<void> {
      if (item.remoteURL) {
          event?.preventDefault();
          window.open(item.url, '_blank');
          return;
      }
      // router.navigate only updates if the inputted link is different to the current route
      // isActive is true means that the menu-item routeLinks is the same as current route url
      if (await this.isActive$.pipe(take(1)).toPromise()) {
          // 'loading' will navigate to the LoadingSpinnerComponent and then the inputted route will be navigated to
          this.refresh({ destLink: item.routerLinks, loadingLink: [this.reloadPath] });
      }
  }

  refresh({ destLink, loadingLink }: { destLink: string[]; loadingLink: string[] }): void {
      // do not block(await) the navigation of loading, the following route.events will catch the completion of loading navigation
      this.router.navigate(loadingLink, { skipLocationChange: false });

      // listen on the last navigation completion, then navigate to the destination link
      this.router.events
          .pipe(
              filter((e) => e instanceof NavigationEnd),
              take(1),
          )
          .subscribe(async () => {
              await this.router.navigate(destLink);
          });
  }

  showAMFPlusBadge(item: MenuItem): boolean {
      return !!item?.features?.includes(FeatureEnum.AMF_PLUS);
  }
}
