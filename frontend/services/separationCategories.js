export class SeparationCategories {

    static getSeparateCategory(operations, removeCardId, categories) {

        const newObject = operations.reduce((object, operation) => {
            if (object[operation.category]) {
                object[operation.category].push(operation)
            } else {
                object[operation.category] = [operation]
            }
            return object
        }, {})

        console.log('categories', categories)

        let foundCategory = categories.find(category => category.id === +(removeCardId))

        console.log('foundCategory', foundCategory)

        console.log('removeCardId', removeCardId)

        console.log('newObject', newObject)

        console.log('IT', newObject[foundCategory.title])

        let amount = 0
        newObject[foundCategory.title]?.forEach(el => {
            amount += el.amount
        })
        console.log('amount', amount)
        // console.log('Object.entries(income)', Object.entries(newObject))

        return amount
    }

}