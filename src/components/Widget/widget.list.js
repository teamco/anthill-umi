import React from 'react';

import Scratch from '@/vendors/widgets/Scratch';
import Picture from '@/vendors/widgets/Picture';
import YouTube from '@/vendors/widgets/YouTube';

export default {
  Scratch: <Scratch />,
  YouTube: (
      <YouTube embedUrl={'https://www.youtube.com/embed/ALZHF5UqnU4'}
               disabledUrl={false} />
  ),
  '24TV.UA': <YouTube embedUrl={'https://youtu.be/LEZeZphNUGY'} />,
  'Espreso.TV': <YouTube embedUrl={'https://youtu.be/6arO8p6gmBI'} />,
  'Prm.UA': <YouTube embedUrl={'https://youtu.be/RmYML3CiypI'} />,
  Zik: <YouTube embedUrl={'https://youtu.be/a_3eJgMMBsg'} />,
  Picture: <Picture imageUrl={'https://www.publicdomainpictures.net/pictures/320000/nahled/background-image.png'} />
};
