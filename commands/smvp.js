const currentWeek = require("./../lib/time.js");
const { ApplicationCommandOptionType } = require('discord.js');

const smvpList = {
  "Glast Heim Hall": [
    "Randgris <:HeavenGate:628903072520994844>",
    "Chimera <:MotleySword:630737574528286730>",
    "Huge Deviling <:DevilSmile:633115813766758401>",
    "Dracula <:BloodyCurse:635789712719609857>"
  ],
  "Clock Tower 2F": [
    "Time Holder - Future <:FutureCrystal:633115850291019837>",
    "Time Holder - Past <:LeviathanSandClock:628903072344703016>",
    "Time Holder - Present <:MarletsPointer:630737574561972254>"
  ],
  "Toy Factory 2F": [
    "Chepet - Rosemary <:FrozenRose:633115878262571018>",
    "Chepet - Iris <:BronzeMirror:628903039918407693>",
    "Chepet - Violet <:GoatskinQuiver:630737573937020949>"
  ],
  "Einbroch Field": [
    "Base Angeling <:PinkHairpin:633116015831547924>",
    "Wise Angeling <:TransparentEmptyBottle:635789712820404247>",
    "Energy Angeling <:EldersCrutch:638241479252246544>",
    "Power Angeling <:ClassifiedDocument:640720405656502294>",
    "Force Angeling <:MachinePart:628903072244170783>",
    "Archangeling <:TheInfectedsDiary:630737574343999509>"
  ],
  "Magma Dungeon 2F": [
    "Firelord - Thunderfire <:OldSafetyHelmet:633115903323537418>",
    "Firelord - Starfire <:MinersIronPickaxe:628903072273268746>",
    "Firelord - Flowfire <:DilapidatedCart:630737574259982336>"
  ],
  "The Misty Forest": [
    "Mad Wolf <:ScarletDress:638241479797768193>",
    "Sadistic Wolf <:GrandmasMuffler:628903072306823188>",
    "Crafty Wolf <:BergmansHuntingRifle:630737573794414622>",
    "Bloodthirsty Wolf <:RochVerasDiary:633116042943791104>",
    "Evil Wolf <:CuteBag:635789712820404224>"
  ]
};

module.exports = {
  name: "smvp",
  description: "Special MVP Info",
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'week',
      description: 'Check drop on next x week (default: 0)',
      min: 0,
      max: 52,
      required: false
    }
  ],
  async processMessage(message, args) {
    const weekNum = currentWeek.week(new Date());
    let str = "SMVP for this week:\n";
    Object.entries(smvpList).forEach(([location, smvps]) => {
      str += location + ": **" + smvps[weekNum % smvps.length] + "**\n";
    });
    await message.channel.send(str);
  },
  async processInteraction(interaction) {
    const skip = interaction.options.getInteger('week')||0;
    const weekNum = currentWeek.week(new Date()) + skip;
    let str;
    if( skip == 0 ) str = "SMVP for this week:\n";
    else if ( skip == 1 ) str = "SMVP for next week:\n";
    else str = `SMVP for ${skip} weeks from now:\n`;

    Object.entries(smvpList).forEach(([location, smvps]) => {
      str += location + ": **" + smvps[weekNum % smvps.length] + "**\n";
    });
    await interaction.reply(str);
  }
};
