using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Fekra_BusinessLayer.Utils
{
    public class KeyProvider
    {
        static Random random = new Random();

        public enum EN_KeyType { Numbers = 1, Letters = 2, NumbersLetters = 3 };

        // Completed Testing.
        private static char GetDiggit(EN_KeyType type)
        {

            if (type == EN_KeyType.NumbersLetters)
                type = (EN_KeyType)random.Next(1, 3);

            switch (type)
            {

                case EN_KeyType.Numbers:
                    return (char)random.Next(48, 58);

                case EN_KeyType.Letters:
                    return (char)random.Next(97, 123);

            }

            return '-';

        }

        // Completed Testing.
        public static string GetPart(int NumberOfDigits, EN_KeyType type)
        {
            string Part = "";

            for (int i = 1; i <= NumberOfDigits; i++)
                Part += GetDiggit(type);

            return Part;
        }

        // Completed Testing.
        public static string GetKey(int NumberOfPartDigits, int NumberOfParts, EN_KeyType type)
        {

            string key = "";

            for (int i = 1; i <= NumberOfParts; i++)
                key += GetPart(NumberOfPartDigits, type) + "-";

            return key.Substring(0, key.Length - 1);

        }
    }
}
