import { useState } from 'react';
import { fetchUnReviewedConsultants } from '../Networking/Firestore';
import { extractDocDataAndIdsAsObjectFromCollectionSnap } from '../Utilities/Tools';

const useUnReviewedConsultantsFetcher = () => {
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);

    try {
      const unReviewedConsultantsCollectionSnap = await fetchUnReviewedConsultants();

      setLoading(false);

      if (unReviewedConsultantsCollectionSnap.empty) return {};
  
      const fetchedUnReviewedConsultants = extractDocDataAndIdsAsObjectFromCollectionSnap(
        unReviewedConsultantsCollectionSnap,
      );
      
      return fetchedUnReviewedConsultants;
    } catch (error) {
      setLoading(false);
      return {};
    }
  }

  return [fetch, loading];
}

export default useUnReviewedConsultantsFetcher;