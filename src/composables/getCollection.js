import { ref, onMounted } from "vue";
import { projectFirestore } from "../firebase/config";

const getCollection = (collection) => {
  const documents = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      const res = await projectFirestore.collection(collection).get();
      documents.value = res.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
    } catch (err) {
      error.value = err.message;
    }
  };

  onMounted(() => {
    load();
  });

  return { documents, error, load };
};

export default getCollection;
