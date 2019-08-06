# CountNow
Acesse o diretório e rode o comando "npm install"

rode também:
npm install rxjs@6 rxjs-compat@6 --save

Se não instalar nada, rode: 
npm i rxjs@^6.0 rxjs-compat



Compilação para Android:

Rode:

Dependências:

Android SDK: 

		https://revryl.com/2013/01/16/android-sdk-installation-ppa/

Android Studio: 

		- Instale o Android Studio e inicie ele para baixar as dependências necessárias (como o emulador)

		- Se ele no build de algo faltando é só ir no SDK Manager e instalar o que ele pediu.
                
		- Se o parçêro não achar o android studio faça: export ANDROID_HOME='Local do Android Studio - ver no SDK Manager'

Se solicitar android-play-services ou Failed to execute aapt na build:

	cordova plugin add cordova-android-play-services-gradle-release --variable PLAY_SERVICES_VERSION=15.0.0 --fetch
	cordova plugin add cordova-android-support-gradle-release --fetch
Gradle:

	sudo add-apt-repository ppa:cwchien/gradle
	sudo apt-get update
	sudo apt install gradle
	
No diretório do app Ionic:

	ionic cordova platform rm android
        ionic cordova platform add android@6.4.0
        ionic cordova build android	 
	(Por padrão, o Cordova irá rodar o mais recente, no entanto, nem todos os plugins funcionaram então como o 6.4.0 tem muitos plugins, é melhor instalar para ele.)
	
