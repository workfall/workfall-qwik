import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { SearchBox } from '~/components/search-box';

export default component$(() => {
  

  return (
    <div>
      <SearchBox />
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Workfall',
  meta: [
    {
      name: 'description',
      content: 'Workfall Qwik App',
    },
  ],
};
