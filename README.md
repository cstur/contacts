本例是一个带热更新的React Native App通讯录Demo
通讯录部分的代码引用了：
https://github.com/chenbin92/React-native-example/blob/ListView-example/app/contact.js

本例可在android设备同时安装测试版和发布版，配置目录android/app/src/debug

* 开发执行npm run start, 然后在模拟器中执行
```
npm run start
```

* 发布执行：
  * Android, 生成安卓签名apk请参考：
    http://reactnative.cn/docs/0.41/signed-apk-android.html

    >$ react-native bundle --platform android --dev false --entry-file index.android.js \
      --bundle-output android/app/src/main/assets/index.android.bundle \
      --assets-dest android/app/src/main/res/

    >$ cd android && ./gradlew assembleRelease

    >$ cd android && ./gradlew installRelease
  * IOS, 生成ipa
    1. xcode 生成ipa可参考http://www.jianshu.com/p/2c62cd3e9cc1
    2. 然后可通过fir分发内侧包，本例地址
        https://fir.im/tc64

#### CodePush 作用
* JS/Images 热更新
* crash 自动回滚

#### 版本支持
codepush 1.17兼容版本：

* ios7+
* android4.1+
* rn0.41

为了保持兼容的版本自动使用rn小版本和codepush最新版本
```
"react-native": "~0.41.2",
"react-native-code-push": "^1.17.0-beta",
```

#### 图片更新有限的支持请参考：
https://github.com/Microsoft/react-native-code-push

#### 教程

1. 安装配置
  ```
  npm install --save react-native-code-push@latest
  ```
  使用rnpm自动配置，这个工具可以完成大部分工作但不是全部

  ```
  react-native link react-native-code-push
  ```
  * android
    修改 android/app/build.gradle
    ```
    android {
        ...
        buildTypes {
            debug {
                ...
                // CodePush updates should not be tested in Debug mode
                ...
            }

            releaseStaging {
                ...
                buildConfigField "String", "CODEPUSH_KEY", '"<INSERT_STAGING_KEY>"'
                ...
            }

            release {
                ...
                buildConfigField "String", "CODEPUSH_KEY", '"<INSERT_PRODUCTION_KEY>"'
                ...
            }
        }
        ...
    }
    ```
    修改 MainApplication
    ```
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
          new MainReactPackage(), new CodePush(BuildConfig.CODEPUSH_KEY, getApplicationContext(), BuildConfig.DEBUG)
      );
    }
    ```
  * ios 可参考官方教程
    https://github.com/Microsoft/react-native-code-push#multi-deployment-testing

2. 使用codepush,并且在开发时禁用,代码位置app/App.js

  ```
  import codePush from "react-native-code-push";

  let MyApp=App;
  if (!__DEV__) {
    MyApp = codePush({ checkFrequency: codePush.CheckFrequency.ON_APP_RESUME, installMode: codePush.InstallMode.ON_NEXT_RESUME })(App);
  }
  export default MyApp;

  ```

3. 发布，为加强体验在ui上加了手动更新按钮

```
code-push release-react contacts android
code-push release-react contacts ios
```
