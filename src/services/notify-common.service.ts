import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import NotifyCommon from '../shared/models/notifycommon';


@Injectable({
    providedIn: 'root'
  })
  export class NotifyCommonService {

    private dbPath ='/CommonNotify';

    notifyCommonRef: AngularFireList<NotifyCommon>;

    constructor(private db: AngularFireDatabase) {
      this.notifyCommonRef = db.list(this.dbPath);
    }

    getAll(): AngularFireList<NotifyCommon> {
      return this.notifyCommonRef;
    }
    getAllByUserId(userid:any) {
       return this.db.object('dbPath/' + userid);
      }

    create(notifys: NotifyCommon[]): any {
      notifys.forEach(rs=>{
        this.notifyCommonRef.push(rs);
      })
        return notifys;
    }
    createNotify(notifys: NotifyCommon): any {
        this.notifyCommonRef.push(notifys);
        return notifys;
    }
    update(key: string, value: any): Promise<void> {
      return this.notifyCommonRef.update(key, value);
    }

    delete(key: string): Promise<void> {
      return this.notifyCommonRef.remove(key);
    }

    deleteAll(): Promise<void> {
      return this.notifyCommonRef.remove();
    }
  }
