export type GetPomlResult =
  | {
      type: 'Success'
      poml: string
    }
  | {
      type: 'NotFound'
    }
  | {
      type: 'Error'
      error: any
    }

export const getPomlAsync = async (pomlId: string): Promise<GetPomlResult> => {
  try {
    const result = await fetch(`/poml/${pomlId}`)
    if (result.ok) {
      const poml = await result.text()
      return {
        type: 'Success',
        poml: poml,
      }
    }

    // Since a new scene is created, there is no poml
    if (result.status === 404) {
      return {
        type: 'NotFound',
      }
    }

    return {
      type: 'Error',
      error: result.statusText,
    }
  } catch (ex) {
    console.log(ex)
    return {
      type: 'Error',
      error: ex,
    }
  }
}
