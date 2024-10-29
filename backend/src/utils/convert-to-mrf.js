export const convertToMRF = (data, fieldMappings = null) => {
    return {
      claims: data.map((item) => {
        const mappedItem = fieldMappings
          ? Object.fromEntries(Object.entries(fieldMappings).map(([key, mappedKey]) => [key, item[mappedKey]]))
          : { ...item };
  
        return mappedItem;
      }),
    };
};