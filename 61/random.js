export const random = (array) => {
    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];
}
