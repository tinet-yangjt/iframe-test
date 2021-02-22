import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebsocketService } from '../core/websocket.service';

@Component({
  selector: 'app-emotion',
  templateUrl: './emotion.component.html',
  styleUrls: ['./emotion.component.less']
})
export class EmotionComponent implements OnInit, OnDestroy {
    wsurl = 'ws://poc1.emotibot.com:8339/ws/assistant/';
    enterpriseId = 'd9f51010dbf646ecb66b60b58b55f64b';
    emotionWS: any;
    asrCount = 0;
    emotionData: any;

    constructor(
        private wsService: WebsocketService,
    ) { }

    ngOnInit(): void {
        this.wsurl = `wss://emotibot-gac-test.gacne.com.cn:443/ws/assistant/`;
        this.enterpriseId = '2';
        this.initEmtionWS();
    }

    initEmtionWS(index: number = 0) {
        // tslint:disable-next-line:max-line-length
        const emotionUrl = `${ this.wsurl }vioce/emotion?ID=7788&first=true&enterpriseId=1&phone=18815615442&index=0&dealerId=GDA0100&callType=2`;
        this.emotionWS = this.wsService.createObservableSocket(emotionUrl).subscribe(
            data => {
                this.emotionData = JSON.parse(data);
                // this.initUserShow(this.emotionData, 'emtion');
                console.log(this.emotionData, 2222222);
            },
            error => {
                console.log(error);
                this.asrCount >= 3 ? console.log('三次重连失败') : this.wsRetry(this.initEmtionWS);
            },
            () => console.log('流已结束')
        );
    }

    // tslint:disable-next-line:ban-types
    wsRetry(func: Function) {
        setTimeout(() => {
            func(1);
            this.asrCount++;
        }, 3000);
    }

    ngOnDestroy() {
        if (this.emotionWS) {
            this.emotionWS.unsubscribe();
        }
        this.asrCount = 0;
    }

}
