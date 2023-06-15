export const Data = [
    {
      id: 'AO',
      text: 'Angola',
      capital: 'Luanda',
      phone: '244',
      currency: 'AOA',
      children: [
        {
          id: 'BJ',
          idPai: 'AO',
          text: 'Benin',
          capital: 'Porto-Novo',
          phone: '229',
          currency: 'XOF'
        },
        {
          id: 'BW',
          idPai: 'AO',
          text: 'Botswana',
          capital: 'Gaborone',
          phone: '267',
          currency: 'BWP'
        },
      ]
    },
    {
      id: 'BF',
      text: 'Burkina Faso',
      capital: 'Ouagadougou',
      phone: '226',
      currency: 'XOF',
      children: [
        {
          id: 'CD',
          idPai: 'BF',
          text: 'Democratic Republic of the Congo',
          capital: 'Kinshasa',
          phone: '243',
          currency: 'CDF'
        },
        {
          id: 'CF',
          idPai: 'BF',
          text: 'Central African Republic',
          capital: 'Bangui',
          phone: '236',
          currency: 'XAF'
        },
        {
          id: 'CG',
          idPai: 'BF',
          text: 'Republic of the Congo',
          capital: 'Brazzaville',
          phone: '242',
          currency: 'XAF'
        },
      ]
    },
    {
     id: 'OT',
      text: 'Outros',
      capital: 'xyz',
      phone: '999',
      currency: 'OTO',
      children: [
              {
                id: 'BI',
                idPai: 'OT',
                text: 'Burundi',
                capital: 'Bujumbura',
                phone: '257',
                currency: 'BIF'
              },
              {
                id: 'CI',
                idPai: 'OT',
                text: 'Ivory Coast',
                capital: 'Yamoussoukro',
                phone: '225',
                currency: 'XOF'
              },
              {
                id: 'CM',
                idPai: 'OT',
                text: 'Cameroon',
                capital: 'Yaoundé',
                phone: '237',
                currency: 'XAF'
              },
              {
                id: 'CV',
                idPai: 'OT',
                text: 'Cape Verde',
                capital: 'Praia',
                phone: '238',
                currency: 'CVE'
              }
        ]
      }
];
