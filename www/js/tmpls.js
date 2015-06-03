angular.module("starter").run(["$templateCache", function($templateCache) {$templateCache.put("index.html","<ion-view title=\"Index Page\">\r\n\r\n  <ion-nav-buttons side=\"right\">\r\n      <button class=\"button button-icon\" ng-click=\"newTask()\">\r\n        <i class=\"icon ion-compose\"></i>\r\n      </button>\r\n  </ion-nav-buttons>\r\n\r\n  <ion-content padding=\"true\">\r\n    <div class=\"row clearfix responsive-sm\" ng-repeat=\"odd in menuOdds\">\r\n       <div class=\"col col-50\">\r\n\r\n        <div class=\"card\">\r\n          <div class=\"item item-text-wrap\">\r\n            <button class=\"button button-clear\" ui-sref=\"{{odd.sref}}\">{{odd.title}}</button>\r\n          </div>\r\n        </div>\r\n\r\n       </div>\r\n       <div class=\"col col-50\">\r\n\r\n        <div class=\"card\">\r\n          <div class=\"item item-text-wrap\">\r\n            <button class=\"button button-clear\" ui-sref=\"{{menuEvens[$index].sref}}\">{{menuEvens[$index].title}}</button>\r\n          </div>\r\n        </div>\r\n\r\n       </div>\r\n    </div>\r\n  </ion-content>\r\n</ion-view>\r\n");
$templateCache.put("left-side-menu.html","<ion-side-menu side=\"left\" >\r\n  <ion-header-bar class=\"bar-dark\">\r\n    <h1 class=\"title\">All list</h1>\r\n  </ion-header-bar>\r\n  <ion-content scroll=\"false\">\r\n    <ion-list>\r\n        <ion-item ng-repeat=\"item in menu\" ui-sref=\"{{item.sref}}\" ng-click=\"selectMenu(item, $index)\" ng-class=\"{active: activeMenu == item}\"  >\r\n          {{item.title}}\r\n        </ion-item>\r\n\r\n    </ion-list>\r\n  </ion-content>\r\n</ion-side-menu>\r\n");
$templateCache.put("modal.html","<!-- popup-->\r\n<ion-modal-view class=\"modal\" ng-controller=\"ModalCtrl\">\r\n\r\n    <!-- Modal header bar -->\r\n    <ion-header-bar class=\"bar-secondary\">\r\n      <h1 class=\"title\">Result</h1>\r\n      <button class=\"button button-clear button-positive\" ng-click=\"closeModal()\">Close</button>\r\n    </ion-header-bar>\r\n\r\n    <!-- Modal content area -->\r\n    <ion-content has-header=\"true\">\r\n\r\n      <ion-list>\r\n        <ion-item ng-repeat=\"item in subsCl | filter: {\'assigned\': true}: true\" class=\"balanced-bg\" >\r\n          {{(item.classGroup ? item.classGroup.serviceTypeCode + \' \' + item.classGroup.levelCode : \'\') + \' \' + item.day + \' \' + item.month + \' \' + item.time + \' NYT\' + \' : success\'}}\r\n        </ion-item>\r\n      </ion-list>\r\n\r\n      <ion-list>\r\n        <ion-item ng-repeat=\"item in subsCl | filter: {\'assigned\': false}: true\" class=\"assertive-bg\">\r\n          {{(item.classGroup ? item.classGroup.serviceTypeCode + \' \' + item.classGroup.levelCode : \'\') + \' \' + item.day + \' \' + item.month + \' \' + item.time + \' NYT\' + \' : fail\'}}\r\n        </ion-item>\r\n      </ion-list>\r\n\r\n    </ion-content>\r\n\r\n</ion-modal-view>\r\n");
$templateCache.put("subs.html","<ion-view title=\"Subs Available\">\r\n\r\n  <ion-nav-buttons side=\"left\">\r\n    <!-- Sub Menu -->\r\n    <button class=\"button button-icon\" ng-click=\"toggleMenu(stateMenu)\">\r\n      <i class=\"icon ion-navicon\"></i>\r\n    </button>\r\n  </ion-nav-buttons>\r\n\r\n  <ion-nav-buttons side=\"right\">\r\n    <button class=\"button icon-left ion-home\" ui-sref=\"index\"></button>\r\n  </ion-nav-buttons>\r\n\r\n\r\n  <ion-content padding=\"true\">\r\n\r\n    <div ng-show=\"(error && error != \'\') || subsCl.length == 0\" class=\"ng-hide card\" >\r\n      <div class=\"item item-text-wrap assertive\">\r\n        {{error}}\r\n      </div>\r\n    </div>\r\n\r\n\r\n\r\n    <div ng-class=\"{\'ng-hide\': subsCl.length == 0}\">\r\n\r\n      <form ng-submit=\"newPost()\">\r\n\r\n        <ion-refresher pulling-text=\"Pull to refresh\" on-refresh=\"doRefresh()\"></ion-refresher>\r\n\r\n        <ion-toggle ng-repeat=\"item in subsCl\" ng-class=\"{\'balanced-bg\': item.assigned, \'assertive-bg\': item.assigned ===false}\" ng-model=\"item.choosen\" toggle-class=\"toggle-calm\">\r\n          {{(item.classGroup ? item.classGroup.serviceTypeCode + \' \' + item.classGroup.levelCode : \'\') + \' \' + item.day + \' \' + item.month + \' \' + item.time + \' NYT\'}}\r\n        </ion-toggle>\r\n\r\n        <button type=\"submit\" class=\"button button-block button-positive\" ng-disabled=\"isDisabled\">Submit</button>\r\n\r\n      </form>\r\n\r\n      <button ng-disabled=\"isDisabled\" class=\"button button-block button-light\" ng-click=\"toggleClaim(toggle=!toggle)\">{{toggle ? \'Check all\':\'Uncheck all\' }}</button>\r\n\r\n    </div>\r\n\r\n\r\n   </ion-content>\r\n</ion-view>\r\n");
$templateCache.put("upcoming.html","<ion-view title=\"Upcoming Classes (NYT)\">\r\n\r\n  <ion-nav-buttons side=\"left\">\r\n    <!-- Sub Menu -->\r\n    <button class=\"button button-icon\" ng-click=\"toggleMenu(stateMenu)\">\r\n      <i class=\"icon ion-navicon\"></i>\r\n    </button>\r\n  </ion-nav-buttons>\r\n  <ion-nav-buttons side=\"right\">\r\n    <button class=\"button icon-left ion-home\" ui-sref=\"index\"></button>\r\n  </ion-nav-buttons>\r\n\r\n  <ion-content padding=\"true\">\r\n\r\n    <div ng-show=\"error && error != \'\'\" class=\"ng-hide card\" >\r\n      <div class=\"item item-text-wrap assertive\">\r\n        {{error}}\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"button-bar bar-stable\" ng-hide=\"{{upcomingCl.length == 0}}\">\r\n          <a class=\"button\">Class&nbsp;Type</a>\r\n          <a class=\"button\">Level</a>\r\n          <a class=\"button\">Date</a>\r\n          <a class=\"button\">Time</a>\r\n   </div>\r\n\r\n    <div class=\"button-bar bar-light\" ng-repeat=\"item in upcomingCl\" >\r\n          <a class=\"button button-small\">{{item.ServiceTypeCode}}</a>\r\n          <a class=\"button button-small\">{{item.LevelCode}}</a>\r\n          <a class=\"button button-small\">{{item.weekday}}</a>\r\n          <a class=\"button button-small\">{{item.time}}</a>\r\n   </div>\r\n\r\n   </ion-content>\r\n\r\n</ion-view>\r\n");}]);