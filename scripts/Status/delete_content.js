import { getDoc, deleteDoc, doc, db,updateDoc } from "./firebase_config.js";
import { loadPendingContent } from "./pending_table.js";

window.deleteContent = async function (docId, type) {
    try {
        const collectionName = type === 'lesson' ? 'lesson_activities' : 'category_activities';
        const requestDocRef = doc(db, collectionName, docId);
        const requestDocSnapshot = await getDoc(requestDocRef);

        if (!requestDocSnapshot.exists()) {
            console.error("Request document not found in", collectionName);
            return;
        }

        const requestData = requestDocSnapshot.data();

        if (!requestData.exactLocation) {
            console.error("Missing exact location of the word document.");
            return;
        }

        // Delete the word document using exactLocation
        const wordDocRef = doc(db, requestData.exactLocation);
        await deleteDoc(wordDocRef);
        console.log("Deleted word document from words subcollection:", requestData.exactLocation);

        // Delete the request document
        await deleteDoc(requestDocRef);
        console.log("Deleted request document from", collectionName);
        
         // Mark the activity as approved in the original collection (lesson_activities or category_activities)
         await updateDoc(activityDocRef, {
            isApprove: true,
            adminAction: "Approved Content",
            timestamp: serverTimestamp()
        });


        // Log the deletion action in the history collection
        const historyRef = collection(db, "history");
        await addDoc(historyRef, {
            action: "Deleted word from " + (type === 'lesson' ? 'Lesson' : 'Category'),
            addedBy: requestData.addedBy,
            adminAction: "Deleted content",
            contentDetails: `Word: ${requestData.word} <br> Translated: ${requestData.translated} <br> Options: ${(requestData.options || []).join(", ")}`,
            documentId: docId,
            lesson_name: requestData.lesson_name || requestData.category_name,
            timestamp: serverTimestamp()
        });
        alert("Content deleted successfully!");
    } catch (error) {
        console.error("Error deleting content:", error);
    }
    loadPendingContent();
};
