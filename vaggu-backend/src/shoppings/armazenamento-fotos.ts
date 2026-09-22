/** Adapta o armazenamento de fotos institucionais ao Vercel Blob.
 * O banco recebe somente a URL pública; token e bytes permanecem no backend.
 */
import { del, put } from '@vercel/blob';

export interface ArmazenamentoFotosShopping {
  salvar(shoppingId: string, conteudo: Buffer, tipoConteudo: string): Promise<string>;
  remover(url: string): Promise<void>;
}

const EXTENSOES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/** Cria o adaptador somente quando o ambiente possui token de escrita do Blob. */
export function criarArmazenamentoFotosBlob(token: string): ArmazenamentoFotosShopping {
  return {
    async salvar(shoppingId, conteudo, tipoConteudo) {
      const extensao = EXTENSOES[tipoConteudo];
      if (!extensao) throw new Error('Tipo de foto não suportado pelo armazenamento.');
      const resultado = await put(`shoppings/${shoppingId}/foto.${extensao}`, conteudo, {
        access: 'public',
        addRandomSuffix: true,
        contentType: tipoConteudo,
        token,
      });
      return resultado.url;
    },
    async remover(url) {
      await del(url, { token });
    },
  };
}
