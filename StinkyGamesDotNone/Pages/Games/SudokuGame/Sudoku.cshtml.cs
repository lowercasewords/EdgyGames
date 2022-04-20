using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace StinkyGamesDotNone.Pages.Games
{
    public class SudokuModel : PageModel
    {
        public Map _map;

        //public event EventHandler Click;

        public void OnPostRestart()
        {
            _map.RestartGrids();
        }
        public void OnGet()
        {
            _map = new Map();
        }

        public void OnSet()
        {

        }
    }
}
