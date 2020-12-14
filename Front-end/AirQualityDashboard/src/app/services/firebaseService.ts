import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";

@Injectable()
export class firebaseService {

  constructor(private firestore: AngularFirestore) {
  }

  setDataInFirebase(collectionPath, docPath, data) {
    this.firestore.collection(collectionPath).doc(docPath).set(data);
  }

  getLiveCollectionFromFirebase(collectionPath) {
    return this.firestore.collection(collectionPath).snapshotChanges()
  }

  getLiveDocumentFromFirebase(collectionPath, docPath) {
    return this.firestore.collection(collectionPath).doc(docPath).snapshotChanges()
  }

  getDataOnceFromFirebase() {

  }

  updateDataFromFirebase() {

  }

  deleteDataFromFirebase() {

  }
}

